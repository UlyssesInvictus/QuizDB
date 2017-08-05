class BonusPart < ApplicationRecord
  belongs_to :bonus

  include Question::Searchable

end
