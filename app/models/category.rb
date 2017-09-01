class Category < ApplicationRecord
  has_many :tossups
  has_many :bonuses, class_name: Bonus
  has_many :bonus_parts, through: :bonuses
  has_many :subcategories

  default_scope { order(name: :asc) }

  ###
  # VALIDATIONS
  ###

  validates :name, uniqueness: true

  before_destroy do
    if tossups.present? || bonuses.present?
      errors.add(:base, "This category still has questions associated with" \
                        " it. Delete or migrate those first!")
      throw(:abort)
    end
  end

end
