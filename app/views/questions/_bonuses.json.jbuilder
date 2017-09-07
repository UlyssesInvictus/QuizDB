json.num_bonuses_found num_bonuses_found
json.bonuses bonuses.includes(:tournament, :category, :subcategory, :bonus_parts) do |bonus|
  json.extract! bonus, :id, :number, :round, :category_id, :subcategory_id,
                       :quinterest_id, :tournament_id, :leadin,
                       :created_at, :updated_at, :formatted_leadin
  # plucking's much faster than actually loading the object
  bonus_parts = bonus.bonus_parts.pluck(:number, :text, :answer,
                                        :formatted_text,
                                        :formatted_answer
                                       )
                                 .sort_by {|b| b[0]}
  json.texts bonus_parts.map {|b| b[1]}
  json.answers bonus_parts.map {|b| b[2]}
  json.formatted_texts bonus_parts.map {|b| b[3]}
  json.formatted_answers bonus_parts.map {|b| b[4]}
  json.url bonus_url(bonus, format: :json)
  json.type "bonus"

  json.tournament({})
  json.tournament do
    tournament = bonus.tournament
    if tournament
      json.extract! tournament, :id, :year, :name,
                                :address, :quality, :type, :link,
                                :created_at, :updated_at
      json.difficulty tournament.difficulty.titleize
      json.difficulty_num Tournament.difficulties[tournament.difficulty]
      json.url tournament_url(tournament, format: :json)
    end
  end
  json.category({})
  json.category do
    category = bonus.category
    if category
      json.extract! category, :id, :name, :created_at, :updated_at
      json.url category_url(category, format: :json)
    end
  end
  json.subcategory({})
  json.subcategory do
    subcategory = bonus.subcategory
    if subcategory
      json.extract! subcategory, :id, :name, :created_at, :updated_at
      json.url subcategory_url(subcategory, format: :json)
    end
  end
end
