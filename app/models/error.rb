class Error < ApplicationRecord
  belongs_to :errorable, polymorphic: true
end
