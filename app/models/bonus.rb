class Bonus < ApplicationRecord
  belongs_to :category, optional: true
  belongs_to :subcategory, optional: true
  belongs_to :tournament, optional: true

  has_many :bonus_parts, dependent: :destroy, inverse_of: :bonus
  accepts_nested_attributes_for :bonus_parts, allow_destroy: true

  has_many :question_errors, as: :errorable, class_name: "Error", dependent: :destroy

  include Question::Filterable
  include ActionView::Helpers::TextHelper
  include Question::Categorizable
  include Question::Tournamentable

  # **********
  # SCOPES
  # **********

  # WARN: Note that these scopes aren't regular filter calls--
  # they'll have extra bandwidth associated because of the fresh ID calls!
  def self.text_contains(query)
    bonus_ids = where("leadin LIKE ?", "%#{query}%").ids
    bonus_part_ids = BonusPart.text_contains(query).pluck(:bonus_id)
    unique_bonus_ids = (bonus_ids + bonus_part_ids).uniq
    where(id: unique_bonus_ids)
  end

  def self.answer_contains(query)
    bonus_part_ids = BonusPart.answer_contains(query).pluck(:bonus_id)
    unique_bonus_ids = bonus_part_ids.uniq
    where(id: unique_bonus_ids)
  end

  def self.contains(query)
    bonus_leadin_ids = where("leadin LIKE ?", "%#{query}%").ids
    bonus_part_ids = BonusPart.contains(query).pluck(:bonus_id)

    bonus_ids = bonus_leadin_ids | bonus_part_ids

    where(id: bonus_ids.uniq)
  end

  def self.text_and_answer_contains(query)
    bonus_ids = where("leadin LIKE ?", "%#{query}%").ids
    bonus_part_ids = BonusPart.text_contains(query).pluck(:bonus_id)
    unique_bonus_text_ids = (bonus_ids + bonus_part_ids).uniq

    bonus_part_ids = BonusPart.answer_contains(query).pluck(:bonus_id)
    unique_bonus_answer_ids = bonus_part_ids.uniq

    where(id: unique_bonus_text_ids & unique_bonus_answer_ids)
  end

  # *************
  # VALIDATIONS
  # *************

  validates :leadin, :formatted_leadin, :round, :number, presence: true
  # validate :has_three_bonus_parts, on: :create

  def has_three_bonus_parts
    # placeholder
    # will fill in if issue of accidentally not associating bonus parts
    # becomes actually problematic
  end

  before_validation do
    allowed_tags = %w( b strong i em u )
    self.formatted_leadin = ActionController::Base.helpers.sanitize(self.formatted_leadin, tags: allowed_tags)
    self.formatted_leadin = self.formatted_leadin&.strip
    self.leadin = self.leadin&.strip
  end


  # *************
  # INSTANCE METHODS
  # *************
  def html_content
    s = "#{formatted_leadin}</br>"
    bonus_parts.order(number: :asc).each do |part|
      s += "[10] #{part.formatted_text}</br>"
      s += "ANSWER: #{part.formatted_answer}</br>"
    end
    s.html_safe
  end

end
