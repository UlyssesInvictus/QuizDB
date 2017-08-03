json.extract! tournament, :id, :year, :name, :difficulty,
                          :address, :quality, :type, :link,
                          :created_at, :updated_at
json.url tournament_url(tournament, format: :json)
