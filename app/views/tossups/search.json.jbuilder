json.data do
  # causes too much extra renders per partial
  # json.tossups tossups, partial: 'tossups/tossup', as: :tossup

  # doesn't work >:| (well, as I want it to)
  # json.cache_collection tossups, expires_in: 30.minutes do |tossup|
  #   json.partial! 'tossups/tossup', tossup: tossup
  # end

  json.num_tossups_found num_tossups_found
  json.num_bonuses_found num_bonuses_found

  json.tossups tossups.includes(:tournament, :category, :subcategory) do |tossup|
    json.extract! tossup, :id, :text, :answer, :number,
      :tournament_id, :category_id, :subcategory_id,
      :round, :created_at, :updated_at, :quinterest_id,
      :formatted_text, :formatted_answer
    json.url tossup_url(tossup, format: :json)
    json.type "tossup"

    # these cause extra renders too
    # json.tournament tossup.tournament, partial: "tournaments/tournament", as: :tournament
    # json.category tossup.category, partial: "categories/category", as: :category
    # json.subcategory tossup.subcategory, partial: "subcategories/subcategory", as: :subcategory

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

  # and now we sadly repeat, for the same reason
  # but I promise this is way faster, I checked
  # json.bonuses bonuses.includes(:bonus_parts), partial: 'bonuses/bonus', as: :bonus

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

    # json.tournament bonus.tournament, partial: "tournaments/tournament", as: :tournament
    # json.category bonus.category, partial: "categories/category", as: :category
    # json.subcategory bonus.subcategory, partial: "subcategories/subcategory", as: :subcategory

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

end
