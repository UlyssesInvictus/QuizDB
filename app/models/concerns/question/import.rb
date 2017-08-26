module Question
  module Import
    def parse_yaml(string, round: nil,
                   tournament_id: nil,
                   category_id: nil,
                   subcategory_id: nil)
      questions = YAML.load(string)
      error_questions = []
      success_questions = []

      questions.each do |q|
        question_hash = {}
        errors = []

        ["tournament", "category", "subcategory"].each do |a|
          if eval("#{a}_id")
            question_hash["#{a}_id"] = eval("#{a}_id")
            next
          end
          a_class = a.classify.constantize
          a_id = q["#{a}_id"].blank? ? nil : a_class.find_by_id(q["#{a}_id"].to_i)&.id
          a_id ||= q[a].blank? ? nil : a_class.find_by_name(q[a])&.id
          if a_id.blank?
            errors.push("Provided #{a} could not be found.") if (q["#{a}_id"].present? || q[a].present?)
          else
            question_hash["#{a}_id"] = a_id
          end
        end
        if (question_hash["category_id"] && question_hash["subcategory_id"] &&
            Subcategory.find(question_hash["subcategory_id"]).category_id != question_hash["category_id"])
          errors.push("Given subcategory does not belong to given category.")
        end
        if errors.any?
          error_questions.push({
            original_question: q,
            errors: errors
          })
        else
          question_hash[:round] = round || q[:round]
          success_questions.push(question_hash)
        end
      end
      {
        errors: error_questions,
        parsed: success_questions
      }
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
          puts "Trying to import question #{counter}"
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
