module Question
  module Categorizable
    extend ActiveSupport::Concern

    included do
      before_validation do
        if self.category.blank? && self.subcategory.present?
          self.category = self.subcategory.category
        end
      end

      validate :subcategory_matches_category
      def subcategory_matches_category
        if subcategory.present?
          if category.blank?
            errors.add(:subcategory, "Category must be provided if subcategory is provided.")
            return false
          end
          if subcategory.category_id != category.id
            errors.add(:subcategory, "Subcategory belongs to #{subcategory.category&.name}, not #{category.name}.")
            return false
          end
        end
        return true
      end
    end
  end

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
      ALLOWED_TAGS = %w( b strong i em u )
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
      validates :text, :answer, :formatted_text, :formatted_answer, presence: true
      before_validation do
        allowed_tags = %w( b strong i em u )
        self.formatted_text = ActionController::Base.helpers.sanitize(self.formatted_text, tags: allowed_tags)
        self.formatted_text = self.formatted_text&.strip
        self.formatted_answer = ActionController::Base.helpers.sanitize(self.formatted_answer, tags: allowed_tags)
        self.formatted_answer = self.formatted_answer&.strip
        self.text = self.text&.strip
        self.answer = self.answer&.strip
      end
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
        filter = filter.present? ? filter : []
        query = query.present? ? query : ""
        if (["Question", "Answer"] - filter).empty?
          contains(query)
        elsif filter.include?("Question")
          text_contains(query)
        # explicitly separate last two cases in case we add new ones
        elsif filter.include?("Answer")
          answer_contains(query)
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

end
