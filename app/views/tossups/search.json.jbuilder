json.data do
  json.tossups tossups, partial: 'tossups/tossup', as: :tossup
  # json.cache_collection tossups, expires_in: 30.minutes do |tossup|
  #   json.partial! 'tossups/tossup', tossup: tossup
  # end
  json.num_tossups_found tossups.size
  json.bonuses []
  json.num_bonuses_found 0
end
