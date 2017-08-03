class Tossup < ApplicationRecord
  belongs_to :tournament
  belongs_to :category
  belongs_to :subcategory
end
