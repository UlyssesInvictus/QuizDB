class Tournament < ApplicationRecord

  enum difficulty: {
    middle_school: 1,
    easy_high_school: 2,
    regular_high_school: 3,
    hard_high_school: 4,
    national_high_school: 5,
    easy_college: 6,
    regular_college: 7,
    national_college: 8,
    open: 9
  }

  enum quality: {
    regular: 1,
    good: 2,
    great: 3
  }

  # possible subtypes
  # TrashTournament, GuerillaTournament, etc.?

  # TODO associations
  # has_many :tossups
  # has_many :bonuses

end
