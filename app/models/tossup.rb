class Tossup < ApplicationRecord
  belongs_to :tournament, optional: true
  belongs_to :category, optional: true
  belongs_to :subcategory, optional: true

  ## SCOPES ##

  include Question::Searchable
  include Question::Filterable


  ## HELPER ACCESSORS ##

  def formatted_text
    self[:formatted_text] ? self[:formatted_text] : text
  end


end
