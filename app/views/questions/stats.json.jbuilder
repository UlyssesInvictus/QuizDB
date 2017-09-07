json.data do
  json.tossups do
    json.year_category_stats tossups.stats_on_category
    json.year_tournament_stats tossups.stats_on_tournament
    if tossups.size < 500
      json.partial! "questions/tossups", locals: {
        tossups: tossups,
        num_tossups_found: tossups.size,
      }
    end
  end
  json.bonuses do
    json.year_category_stats bonuses.stats_on_category
    json.year_tournament_stats bonuses.stats_on_tournament
    if bonuses.size < 500
      json.partial! "questions/bonuses", locals: {
        bonuses: bonuses,
        num_bonuses_found: bonuses.size
      }
    end
  end
end
