json.extract! tossup, :id, :text, :answer, :number,
  :tournament_id, :category_id, :subcategory_id,
  :round, :created_at, :updated_at, :quinterest_id,
  :formatted_text
json.url tossup_url(tossup, format: :json)
