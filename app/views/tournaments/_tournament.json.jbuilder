# json.cache ['v1', tournament], expires_in: 30.minutes do
  json.extract! tournament, :id, :year, :name,
                            :address, :quality, :type, :link,
                            :created_at, :updated_at
  json.difficulty tournament.difficulty.titleize
  json.difficulty_num Tournament.difficulties[tournament.difficulty]
  json.url tournament_url(tournament, format: :json)
# end
