json.data do
  json.tossups tossups, partial: 'tossups/tossup', as: :tossup
  # json.cache_collection tossups, expires_in: 30.minutes do |tossup|
  #   json.partial! 'tossups/tossup', tossup: tossup
  # end
  json.num_tossups_found num_tossups_found
  json.bonuses bonuses.includes(:bonus_parts), partial: 'bonuses/bonus', as: :bonus
  json.num_bonuses_found num_bonuses_found
end
