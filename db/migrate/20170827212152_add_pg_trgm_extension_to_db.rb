class AddPgTrgmExtensionToDb < ActiveRecord::Migration[5.0]
  def self.up
    enable_extension :pg_trgm
  end

  def self.down
    execute "DROP EXTENSION IF EXISTS pg_trgm"
  end
end
