module Question
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

      def by_filters(filters)
        if filters.present?
          # annoyingly hardcoded, but effectively acts as
          # a whitelist on the filters allowed as well
          filter_by_key(filters, :category)
          .filter_by_key(filters, :subcategory)
          .filter_by_key(filters, :tournament)
          .filter_by_key(filters, :difficulty)
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
          (0..2).each do |i|
            q_part = BonusPart.new(bonus_id: q_record.id, number: i + 1)
            q_part.text = (q["texts"][i].present? ? q["texts"][i] : "")
            q_part.answer = (q["answers"][i].present? ? q["answers"][i] : "")
            q_part.save
          end
        end
        if !tournaments[q["tournament"]]
          year = q["year"].present? ? q["year"].to_i : nil
          tourney_id = Tournament.create(name: q["tournament"], year: year, difficulty: 5).id
          tournaments[q["tournament"]] = tourney_id
        else
          tourney_id = tournaments[q["tournament"]]
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

        counter += 1
      end
    end
  end


end
