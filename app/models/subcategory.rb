class Subcategory < ApplicationRecord
  belongs_to :category
  has_many :tossups
  has_many :bonuses, class_name: "Bonus"
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

  ###
  # CLASS METHODS
  ###

  def self.select_options
    pluck(:name, :id)
  end

  def self.select_options_by_important
    # make sure the big 3 come first
    hist = where("name ILIKE ?", "%History%")
    lit = where("name ILIKE ?", "%Literature%")
    science = where("name ILIKE ?", "%Science%").where.not("name ILIKE ?", "%Social Science%")
    # then don't give a shit about the rest
    others = where.not(id: hist.ids + lit.ids + science.ids)
    hist.select_options + lit.select_options + science.select_options + others.select_options
  end

end
