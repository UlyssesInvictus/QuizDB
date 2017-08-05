class Bonus < ApplicationRecord
  belongs_to :category
  belongs_to :subcategory
  belongs_to :tournament

  has_many :bonus_parts, dependent: :destroy

  validate :has_three_bonus_parts, on: :create

  def has_three_bonus_parts
    # placeholder
    # will fill in if issue of accidentally not associating bonus parts
    # becomes actually problematic
  end
end
