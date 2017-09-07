json.data do
  json.tossups do
    json.year_category_stats tossups.stats_by_year_and_category
    json.year_difficulty_stats tossups.stats_by_year_and_difficulty
    json.category_stats tossups.stats_by_category
    if tossups.size < 500
      json.partial! "questions/tossups", locals: {
        tossups: tossups,
        num_tossups_found: tossups.size,
      }
    end
  end
  json.bonuses do
    json.year_category_stats bonuses.stats_by_year_and_category
    json.year_difficulty_stats bonuses.stats_by_year_and_difficulty
    json.category_stats bonuses.stats_by_category
    if bonuses.size < 500
      json.partial! "questions/bonuses", locals: {
        bonuses: bonuses,
        num_bonuses_found: bonuses.size
      }
    end
  end
end
