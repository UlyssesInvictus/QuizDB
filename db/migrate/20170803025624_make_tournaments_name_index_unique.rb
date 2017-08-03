class MakeTournamentsNameIndexUnique < ActiveRecord::Migration[5.0]
  def change
    remove_index :tournaments, [:name]
    add_index :tournaments, [:name], unique: true
  end
end
