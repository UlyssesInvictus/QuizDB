json.data do
  # json.tossup_stats do
  #   json.year_category_stats tossups.stats_by_year_and_category
  #   json.year_difficulty_stats tossups.stats_by_year_and_difficulty
  #   json.category_stats tossups.stats_by_category
  #   if tossups.size < 500
  #     json.partial! "questions/tossups", locals: {
  #       tossups: tossups,
  #       num_tossups_found: tossups.size,
  #     }
  #   end
  # end
  # json.bonus_stats do
  #   json.year_category_stats bonuses.stats_by_year_and_category
  #   json.year_difficulty_stats bonuses.stats_by_year_and_difficulty
  #   json.category_stats bonuses.stats_by_category
  #   if bonuses.size < 500
  #     json.partial! "questions/bonuses", locals: {
  #       bonuses: bonuses,
  #       num_bonuses_found: bonuses.size
  #     }
  #   end
  # end

  # TODO: put this all in actual good code format...

  json.partial! "questions/tossups", locals: {
    tossups: tossups.size < 500 ? tossups : Tossup.none,
    num_tossups_found: tossups.size,
  }

  json.partial! "questions/bonuses", locals: {
    bonuses: bonuses.size < 500 ? bonuses : Bonus.none,
    num_bonuses_found: bonuses.size,
  }

  tossup_stats = tossups.stats_by_year_and_category.deep_merge(tossups.stats_by_year_and_difficulty)
  bonus_stats = bonuses.stats_by_year_and_category.deep_merge(bonuses.stats_by_year_and_difficulty)

  years = Tournament.reorder("").distinct(:year).pluck(:year)
  difficulties = Tournament.reorder("").difficulties_titleized
  categories = Category.distinct(:name).pluck(:name)

  json.years years do |y|
    json.year y
    json.tossups do
      json.total tossup_stats[y.to_s] ? tossup_stats[y.to_s][:total] : 0
      json.categories categories do |c|
        json.category c
        json.total tossup_stats[y.to_s] ? (tossup_stats[y.to_s][c] || 0) : 0
      end
      json.difficulties difficulties.keys do |d|
        json.difficulty d
        json.total tossup_stats[y.to_s] ? (tossup_stats[y.to_s][difficulties[d].to_s] || 0) : 0
      end
    end
    json.bonuses do
      json.total bonus_stats[y.to_s] ? bonus_stats[y.to_s][:total] : 0
      json.categories categories do |c|
        json.category c
        json.total bonus_stats[y.to_s] ? (bonus_stats[y.to_s][c] || 0) : 0
      end
      json.difficulties difficulties.keys do |d|
        json.difficulty d
        json.total bonus_stats[y.to_s] ? (bonus_stats[y.to_s][difficulties[d].to_s] || 0) : 0
      end
    end
  end

end
