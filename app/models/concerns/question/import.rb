module Question
  module Import
    # a massive mess
    # do not treat this as good code
    # scripting: not even once
    def parse_yaml(questions:, round: nil,
                   tournament_id: nil,
                   category_id: nil,
                   subcategory_id: nil,
                   force: false)
      questions = YAML.load(questions)
      error_questions = []
      success_questions = []

      # if number not provided, try to guess based on position in file
      tossup_number = 1
      bonus_number = 1
      question_models = []

      questions.each do |q|
        question_hash = {}
        errors = []
        q = q.with_indifferent_access
        # validate or look up various associations based on name/ID
        ["tournament", "category", "subcategory"].each do |a|
          if eval("#{a}_id").present?
            question_hash["#{a}_id"] = eval("#{a}_id").to_i
          end
          a_class = a.classify.constantize
          a_id = q["#{a}_id"].blank? ? nil : a_class.find_by_id(q["#{a}_id"].to_i)&.id
          a_id ||= (q[a].blank? || q[a] == "None") ? nil : a_class.find_by_name(q[a])&.id
          if a_id.blank?
            errors.push("Provided #{a} could not be found.") if (q["#{a}_id"].present? || (q[a].present? && q[a] != "None"))
          else
            question_hash["#{a}_id"] = a_id
          end
        end
        if (question_hash["category_id"] && question_hash["subcategory_id"] &&
            Subcategory.exists?(id: question_hash["subcategory_id"]) &&
            Subcategory.find(question_hash["subcategory_id"]).category_id != question_hash["category_id"])
          errors.push("Given subcategory does not belong to given category.")
        end

        # the one case that doesn't depend on question type...
        question_hash[:round] = q[:round] || round

        # handle adding answers
        if q[:answer].blank? && q[:answers].blank?
          errors.push("At least some answer must be provided.")
        elsif q[:type]&.downcase == "tossup" ||
              q[:answer].present? ||
              q[:answers].length == 1
          question_hash[:type] = "Tossup"
          question_hash[:text] = q[:text]
          question_hash[:formatted_text] = q[:formatted_text] || question_hash[:text]
          question_hash[:answer] = q[:answer] || q[:answers][0]
          question_hash[:formatted_answer] = q[:formatted_answer] || question_hash[:answer]
          if q[:number].present?
            question_hash[:number] = q[:number].to_i
            tossup_number = q[:number].to_i
          else
            question_hash[:number] = tossup_number
            tossup_number += 1
          end
          # if we've got this far, actually try making the question and see what errors we get
          if errors.empty?
            t = Tossup.new(question_hash.except(:type))
            errors.concat(t.errors.full_messages) unless t.valid?
            question_models.push(t)
          end
        else
          question_hash[:type] = "Bonus"
          question_hash[:leadin] = q[:leadin]
          question_hash[:formatted_leadin] = q[:formatted_leadin] || q[:leadin]
          question_hash[:answers] = q[:answers]
          question_hash[:texts] = q[:texts]
          question_hash[:formatted_answers] = q[:formatted_answers] || q[:answers]
          question_hash[:formatted_texts] = q[:formatted_texts] || q[:texts]
          if q[:number].present?
            question_hash[:number] = q[:number].to_i
            bonus_number = q[:number].to_i
          else
            question_hash[:number] = bonus_number
            bonus_number += 1
          end
          if errors.empty?
            b = Bonus.new(question_hash.except(:type, :answers, :texts,
                                               :formatted_answers, :formatted_texts))
            errors.concat(b.errors.full_messages) unless b.valid?
            question_models.push(b)
            question_hash[:answers].each_with_index do |answer, i|
              part = BonusPart.new(text: question_hash[:texts][i],
                                   answer: question_hash[:answers][i],
                                   formatted_text: question_hash[:formatted_texts][i],
                                   formatted_answer: question_hash[:formatted_answers][i],
                                   number: i+1
                                  )
              errors.concat(part.errors.messages.except(:bonus).values.flatten) unless part.valid?
              question_models.push(part)
            end
          end
        end

        if errors.any?
          error_questions.push({
            original_input: q,
            errors: errors
          })
        else
          success_questions.push(question_hash)
        end
      end
      if force
        # stupid way to do it, but it avoids having to read in all the attrs again
        current_bonus_id = -1

        Tossup.transaction do
          question_models.each do |q|
            q.bonus_id = current_bonus_id if q.class.name == "BonusPart"
            q.save!
            current_bonus_id = q.id if q.class.name == "Bonus"
          end
        end
      end

      {
        errors: error_questions,
        questions: success_questions
      }
    end

    # one off method to load tournaments from quinterest db dump
    def load_tournaments(filename)
      json_string = File.open(filename).read
      questions = JSON.parse(json_string)

      ActiveRecord::Base.transaction do
        questions.each do |q|
          tournament = q["Tournament"]
          year = q["Year"].to_i
          if !Tournament.exists?(name: "#{year} #{tournament}")
            Tournament.create(name: "#{year} #{tournament}", year: year, difficulty: 5)
            puts "Creating tournament: #{year} #{tournament}"
          end
        end
      end
    end

    def load_categories(filename)
      json_string = File.open(filename).read
      questions = JSON.parse(json_string)

      ActiveRecord::Base.transaction do
        questions.each do |q|
          category = q["Category"]
          if !Category.exists?(name: "#{category}")
            Category.create(name: "#{category}")
            puts "Creating category: #{category}"
          end
        end
      end
    end

    def load_subcategories(filename)
      json_string = File.open(filename).read
      questions = JSON.parse(json_string)

      ActiveRecord::Base.transaction do
        questions.each do |q|
          category = q["Category"]
          subcategory = q["Subcategory"]
          if subcategory.present? && !Subcategory.exists?(name: "#{category} #{subcategory}")
            category_id = Category.find_by_name(category).id
            Subcategory.create(name: "#{category} #{subcategory}", category_id: category_id)
            puts "Creating subcategory: #{category} #{subcategory}"
          end
        end
      end
    end

    def load_quinterest_tossups(filename)
      json_string = File.open(filename).read
      questions = JSON.parse(json_string)

      counter = 0
      ActiveRecord::Base.transaction do
        questions.each do |q|
          if counter % 100 == 0
            puts "Trying to import question #{counter}"
          end

          attributes = {
            answer: q["Answer"],
            text: q["Question"],
            round: q["Round"],
            number: q["Question #"].to_i,
            quinterest_id: q["ID"].to_i
          }
          if q["Tournament"].present?
            year = q["Year"].to_i
            tournament = q["Tournament"]
            attributes[:tournament_id] = Tournament.find_by_name("#{year} #{tournament}").id
          end
          if q["Category"].present?
            attributes[:category_id] = Category.find_by_name(q["Category"]).id
          end
          if q["Subcategory"].present? && q["Subcategory"] != "None"
            category = q["Category"]
            subcategory = q["Subcategory"]
            attributes[:subcategory_id] = Subcategory.find_by_name("#{category} #{subcategory}").id
          end

          Tossup.create(attributes)
          counter += 1
        end
      end
    end

    def load_quinterest_bonuses(filename)
      json_string = File.open(filename).read
      questions = JSON.parse(json_string)

      counter = 0
      ActiveRecord::Base.transaction do
        questions.each do |q|
          if counter % 50 == 0
            puts "Trying to import question #{counter}"
          end

          attributes = {
            leadin: q["Intro"],
            formatted_leadin: q["Intro"],
            round: q["Round"],
            number: q["Question #"].to_i,
            quinterest_id: q["ID"].to_i
          }
          if q["Tournament"].present?
            year = q["Year"].to_i
            tournament = q["Tournament"]
            attributes[:tournament_id] = Tournament.find_by_name("#{year} #{tournament}").id
          end
          if q["Category"].present?
            attributes[:category_id] = Category.find_by_name(q["Category"]).id
          end
          if q["Subcategory"].present? && q["Subcategory"] != "None"
            category = q["Category"]
            subcategory = q["Subcategory"]
            attributes[:subcategory_id] = Subcategory.find_by_name("#{category} #{subcategory}").id
          end

          b = Bonus.create(attributes)

          (1..3).each do |i|
            if q["Question#{i}"].present? || q["Answer#{i}"].present?
              part_attributes = {
                text: q["Question#{i}"],
                formatted_text: q["Question#{i}"],
                answer: q["Answer#{i}"],
                formatted_answer: q["Answer#{i}"],
                number: i,
                bonus_id: b.id
              }
              BonusPart.create(part_attributes)
            end
          end
          counter += 1
        end
      end
    end

    # to implement: https://github.com/zdennis/activerecord-import
    def load_from_json_file(filename)
      json_string = File.open(filename).read
      questions = JSON.parse(json_string)

      tournaments = {}
      categories = {}
      subcategories = {}
      counter = 0

      ActiveRecord::Base.transaction do
        questions.each do |q|
          if q["answer"]
            q_record = Tossup.new(text: q["text"], answer: q["answer"],
                                 number: q["number"].to_i,
                                 quinterest_id: q["quinterest_id"].to_i,
                                 round: q["round"])
          else
            q_record = Bonus.new(number: q["number"].to_i,
                                quinterest_id: q["quinterest_id"].to_i,
                                round: q["round"], leadin: q["leadin"])
          end
          tourney_name = q["year"] + " " + q["tournament"]
          if !tournaments[tourney_name]
            year = q["year"].present? ? q["year"].to_i : nil
            tourney_id = Tournament.create(name: tourney_name, year: year, difficulty: 5).id
            tournaments[tourney_name] = tourney_id
          else
            tourney_id = tournaments[tourney_name]
          end
          if q["category"].blank?
            category_id = nil
          elsif !categories[q["category"]]
            category_id = Category.create(name: q["category"]).id
            categories[q["category"]] = category_id
          else
            category_id = categories[q["category"]]
          end
          if q["subcategory"].blank? || q["category"].blank?
            subcategory_id = nil
          elsif !subcategories[q["subcategory"]]
            subcategory_id = Subcategory.create(name: q["subcategory"]).id
            subcategories[q["subcategory"]] = subcategory_id
          else
            subcategory_id = subcategories[q["subcategory"]]
          end
          q_record.tournament_id = tourney_id
          q_record.subcategory_id = subcategory_id
          q_record.category_id = category_id
          q_record.save!
          if q["answers"]
            (0..2).each do |i|
              q_part = BonusPart.new(bonus_id: q_record.id, number: i + 1)
              q_part.text = (q["texts"][i].present? ? q["texts"][i] : "")
              q_part.answer = (q["answers"][i].present? ? q["answers"][i] : "")
              q_part.save
            end
          end

          counter += 1
        end
      end
    end
  end
end
