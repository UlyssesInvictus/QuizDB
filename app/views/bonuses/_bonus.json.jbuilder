json.extract! bonus, :id, :number, :round, :category_id, :subcategory_id,
                     :quinterest_id, :tournament_id, :leadin,
                     :created_at, :updated_at
bonus_parts = bonus.bonus_parts.pluck(:text, :answer)
json.texts bonus_parts.map {|b| b[0]}
json.answers bonus_parts.map {|b| b[1]}
json.url bonus_url(bonus, format: :json)
