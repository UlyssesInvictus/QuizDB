class Subcategory < ApplicationRecord
  belongs_to :category
  has_many :tossups
  has_many :bonuses, class_name: Bonus
  has_many :bonus_parts, through: :bonuses

  default_scope { order(name: :asc) }

  ###
  # VALIDATIONS
  ###

  validates :name, uniqueness: true
  validates :name, :category_id, presence: true

  before_destroy do
    if tossups.present? || bonuses.present?
      errors.add(:base, "This subcategory still has questions associated with" \
                        " it. Delete or migrate those first!")
      throw(:abort)
    end
  end

end
