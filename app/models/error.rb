class Error < ApplicationRecord
  belongs_to :errorable, polymorphic: true

  enum error_type: {
    other: 0,
    question: 1,
    question_info: 2,
    question_formatting: 3,
  }

  def error_type_description
    {
      other: "Any issue not included above.",
      question: "Incomplete or missing question text.",
      question_info: "Incomplete or inaccurate question info (tournament, category, etc.).",
      question_formatting: "Formatting or display issues with question text or info."
    }[error_type]
  end

end
