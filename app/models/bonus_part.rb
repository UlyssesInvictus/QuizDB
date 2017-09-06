class BonusPart < ApplicationRecord
  belongs_to :bonus

  include Question::Searchable

  default_scope { order(number: :asc) } 

end
