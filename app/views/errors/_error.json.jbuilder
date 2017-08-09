json.extract! error, :id, :description, :error_type, :resolved,
                     :errorable_id, :errorable_type,
                     :created_at, :updated_at
json.url error_url(error, format: :json)
