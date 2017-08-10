class Error < ApplicationRecord
  belongs_to :errorable, polymorphic: true

  enum error_type: {
    question: 1,
    question_info: 2,
    question_formatting: 3,
    # make sure this one goes last!
    # want "none of the above" description to make sense
    other: 0,
  }

  def self.error_type_description(e)
    {
      other: "Any issue not included above.",
      question: "Incomplete or missing question text.",
      question_info: "Incomplete or inaccurate question info (tournament, category, etc.).",
      question_formatting: "Formatting or display issues with question text or info."
    }[e]
  end

  def question
    if %w(Tossup Bonus).include? errorable_type
      errorable
    else
      raise "Wrong type of errorable being accessed"
    end
  end

  def tossup
    if "Tossup" == errorable_type
      errorable
    else
      raise "Wrong type of errorable being accessed"
    end
  end

  def bonus
    if "Bonus" == errorable_type
      errorable
    else
      raise "Wrong type of errorable being accessed"
    end
  end

end
