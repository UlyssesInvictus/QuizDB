class Tournament < ApplicationRecord

  has_many :tossups
  has_many :bonuses, class_name: Bonus
  has_many :bonus_parts, through: :bonuses

  enum difficulty: {
    middle_school: 1,
    easy_high_school: 2,
    regular_high_school: 3,
    hard_high_school: 4,
    national_high_school: 5,
    easy_college: 6,
    regular_college: 7,
    hard_college: 8,
    open: 9
  }

  enum quality: {
    terrible: -2,
    poor: -1,
    okay: 0,
    good: 1,
    amazing: 2
  }

  default_scope { order(year: :desc, name: :asc) }

  scope :name_contains, -> (name) { where("name ILIKE ?", "%#{name}%") }

  # possible subtypes
  # TrashTournament, GuerillaTournament, etc.?

  def self.difficulties_to_int(diffs)
    diffs.map {|d| difficulties[d]}
  end

  def self.difficulties_titleized
    d_t = {}
    difficulties.each do |k, v|
      d_t[k.titleize] = v
    end
    d_t
  end

  def self.qualities_titleized
    d_t = {}
    qualities.each do |k, v|
      d_t[k.titleize] = v
    end
    d_t
  end

  def self.quality_description(q)
    {
      terrible: "Exceptionally bad, either for reasons of age, on purpose, or just plain bad question writing.",
      poor: "Worse than average, due to talent or experience of writing team, or just typical procrastination.",
      okay: "The average question set.",
      good: "Better than average, thanks to talent or experience of writing team, as well as a good writing schedule.",
      amazing: "Exceptionally good questions. Very high merit as study material or just fun to play."
    }[q]
  end


end
