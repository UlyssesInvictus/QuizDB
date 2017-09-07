class Tossup < ApplicationRecord
  belongs_to :tournament, optional: true
  belongs_to :category, optional: true
  belongs_to :subcategory, optional: true

  has_many :question_errors, as: :errorable, class_name: "Error", dependent: :destroy

  ## SCOPES ##

  include Question::Searchable
  include Question::Filterable
  include Question::Categorizable
  include Question::Tournamentable

  ## VALIDATIONS ##

  validates :round, :number, presence: true

  ## HELPER ACCESSORS ##

  def formatted_text
    self[:formatted_text] ? self[:formatted_text] : text
  end



end
