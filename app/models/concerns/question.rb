module Question
  module SearchAndFilter
    def self.search_and_filter(query, filters)
      if filters
        if filters[:question_type]
          question_type_filter = filters[:question_type]
          if (["Tossup", "Bonus"] - question_type_filter).empty?
            tossups = Tossup.filter_by_defaults(filters, query)
            bonuses = Bonus.filter_by_defaults(filters, query)
          elsif question_type_filter.include?("Tossup")
            tossups = Tossup.filter_by_defaults(filters, query)
            bonuses = Bonus.none
          else
            tossups = Tossup.none
            bonuses = Bonus.filter_by_defaults(filters, query)
          end
        else
          tossups = Tossup.filter_by_defaults(filters, query)
          bonuses = Bonus.filter_by_defaults(filters, query)
        end
      else
        tossups = Tossup.filter_by_defaults({}, query)
        bonuses = Bonus.filter_by_defaults({}, query)
      end
      {
        tossups: tossups,
        bonuses: bonuses
      }
    end
  end


  module Searchable
    extend ActiveSupport::Concern
    included do
      scope :text_contains, -> (query) { where("text ILIKE ?", "%#{query}%") }
      scope :answer_contains, -> (query) { where("answer ILIKE ?", "%#{query}%") }
      scope :text_and_answer_contains, -> (query) {
        where("answer ILIKE ?", "%#{query}%")
        .where("text ILIKE ?", "%#{query}%")
      }
      scope :contains, -> (query) {
        text_contains(query)
        .or(answer_contains(query)
      )}
      scope :text_or_answer_contains, -> (query) {
        text_or_answer_contains(query)
      }
    end
  end

  module Filterable
    extend ActiveSupport::Concern
    class_methods do
      def filter_by_key(filters, key)
        if filters[key].present?
          where(key => filters[key])
        else
          all
        end
      end

      def filter_by_defaults(filters, query)
        results = all
        if filters.present?
          # annoyingly hardcoded, but effectively acts as
          # a whitelist on the filters allowed as well
          results = results.filter_by_key(filters, :category)
          .filter_by_key(filters, :subcategory)
          .filter_by_key(filters, :tournament)
          .filter_by_difficulty(filters[:difficulty])
          .filter_by_search_type(filters[:search_type], query)
        else
          results = results.filter_by_search_type({}, query)
        end
        results
      end

      def filter_by_search_type(filter, query)
        query = query.present? ? query : ""
        if filter.blank? || (["Question", "Answer"] - filter).empty?
          contains(query)
        elsif filter.include?("Question")
          text_contains(query)
        else
          answer_contains(query)
        end
      end

      def filter_by_difficulty(filter)
        if filter.present?
          # JOINS creates direct SQL query, so need the actual ints
          diffs = Tournament.difficulties_to_int(filter)
          joins(:tournament).where(tournaments: { difficulty: diffs })
        else
          all
        end
      end

    end
  end

  # eh...shouldn't just combine this with my concerns
  # but still very small project size, so :/

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
