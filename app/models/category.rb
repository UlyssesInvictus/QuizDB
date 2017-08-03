class Category < ApplicationRecord
  has_many :tossups
  # has_many :bonuses
  has_many :subcategories
end
