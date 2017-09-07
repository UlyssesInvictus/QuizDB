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
      validates :category_id, presence: true
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

    class_methods do
      def stats_on_category
        raw_stats = reorder("")
          .joins(:tournament, :category)
          .group("tournaments.year", "categories.name")
          .size
        stats = {}
        raw_stats.each do |stat, count|
          year = stat[0].to_s
          category = stat[1].to_s
          stats[year] = { total: 0 } if stats[year].blank?
          stats[year][category] = 0 if stats[year][category].blank?
          stats[year][:total] += count
          stats[year][category] += count
        end
        stats
      end
    end

  end

  module Tournamentable
    extend ActiveSupport::Concern

    included do
      validates :tournament_id, presence: true
    end

    class_methods do
      def stats_on_tournament
        raw_stats = reorder("")
          .joins(:tournament)
          .group("tournaments.year", "tournaments.difficulty")
          .size
        stats = {}
        raw_stats.each do |stat, count|
          year = stat[0].to_s
          difficulty = stat[1].to_s
          stats[year] = { total: 0 } if stats[year].blank?
          stats[year][difficulty] = 0 if stats[year][difficulty].blank?
          stats[year][:total] += count
          stats[year][difficulty] += count
        end
        stats
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
    included do
      scope :most_recent, -> { includes(:tournament).order('tournaments.year desc, tournaments.name asc') }
      default_scope -> { most_recent }
    end
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
        # TODO: make fuzzy search the default!
        query = query.split(" ")
        results = all
        query.each do |q|
          if (["Question", "Answer"] - filter).empty?
            results = results.contains(q)
          elsif filter.include?("Question")
            results = results.text_contains(q)
          # explicitly separate last two cases in case we add new ones
          elsif filter.include?("Answer")
            results = results.answer_contains(q)
          else
            results = results.answer_contains(q)
          end
        end
        results
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
