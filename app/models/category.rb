class Category < ApplicationRecord
  has_many :tossups
  has_many :bonuses, class_name: "Bonus"
  has_many :bonus_parts, through: :bonuses
  has_many :subcategories

  default_scope { order(name: :asc) }

  ###
  # VALIDATIONS
  ###

  validates :name, uniqueness: true
  validates :name, presence: true

  before_destroy do
    if tossups.present? || bonuses.present?
      errors.add(:base, "This category still has questions associated with" \
                        " it. Delete or migrate those first!")
      throw(:abort)
    end
  end

  ###
  # CLASS METHODS
  ###

  def self.select_options
    pluck(:name, :id)
  end

  def self.select_options_by_important
    # make sure the big 3 come first
    big_three = where(name: %w(Literature Science History))
    # then don't give a shit about the rest
    others = where.not(name: %w(Literature Science History))
    big_three.select_options + others.select_options
  end

end
