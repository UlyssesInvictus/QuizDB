json.num_tossups_found num_tossups_found
json.tossups tossups.includes(:tournament, :category, :subcategory) do |tossup|
  json.extract! tossup, :id, :text, :answer, :number,
    :tournament_id, :category_id, :subcategory_id,
    :round, :created_at, :updated_at, :quinterest_id,
    :formatted_text, :formatted_answer
  json.url tossup_url(tossup, format: :json)
  json.type "tossup"

  # need to explicitly set field if no render
  # will just be overwritten by real thing if real thing exists
  json.tournament({})
  json.tournament do
    tournament = tossup.tournament
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
    category = tossup.category
    if category
      json.extract! category, :id, :name, :created_at, :updated_at
      json.url category_url(category, format: :json)
    end
  end
  json.subcategory({})
  json.subcategory do
    subcategory = tossup.subcategory
    if subcategory
      json.extract! subcategory, :id, :name, :created_at, :updated_at
      json.url subcategory_url(subcategory, format: :json)
    end
  end
end
