class Tossup < ApplicationRecord
  belongs_to :tournament
  belongs_to :category
  belongs_to :subcategory

  scope :text_contains, -> (query) { where("text LIKE ?", "%#{query}%") }
  scope :answer_contains, -> (query) { where("answer LIKE ?", "%#{query}%") }
  scope :text_and_answer_contains, -> (query) {
    where("answer LIKE ?", "%#{query}%")
    .where("text LIKE ?", "%#{query}%")
  }
  scope :contains, -> (query) {
    text_contains(query)
    .or(answer_contains(query)
  )}

  def self.filter_by_key(filters, key)
    if filters[key].present?
      where(key => filters[key])
    else
      all
    end
  end

  def self.by_filters(filters)
    if filters.present?
      # annoyingly hardcoded, but effectively acts as
      # a whitelist on the filters allowed as well
      filter_by_key(filters, :category)
      .filter_by_key(filters, :subcategory)
      .filter_by_key(filters, :tournament)
      .filter_by_key(filters, :difficulty)
    else
      all
    end
  end


end
