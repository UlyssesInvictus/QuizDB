class Category < ApplicationRecord
  has_many :tossups
  has_many :bonuses, class_name: Bonus
  has_many :bonus_parts, through: :bonuses
  has_many :subcategories

  default_scope { order(name: :asc) }
end
