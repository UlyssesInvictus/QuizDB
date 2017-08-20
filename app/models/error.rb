class Error < ApplicationRecord
  belongs_to :errorable, polymorphic: true, counter_cache: true

  enum error_type: {
    question_text: 1,
    question_info: 2,
    question_formatting: 3,
    # make sure this one goes last!
    # want "none of the above" description to make sense
    other: 0,
  }

  after_create :update_counter_cache
  after_save :update_counter_cache
  after_update :update_counter_cache
  after_destroy :update_counter_cache

  def self.error_type_description(e)
    {
      other: "Any issue not included above.",
      question_text: "Incomplete or missing question text.",
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

  def resolve!
    update!(resolved: true)
  end

  ### ASSOCIATIONS ###

  def update_counter_cache
    self.errorable.update(errors_count: Error.where(errorable_id: errorable_id,
                                                    resolved: false).size
                          )
  end

end
