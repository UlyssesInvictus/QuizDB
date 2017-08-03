class CreateTournaments < ActiveRecord::Migration[5.0]
  def change
    create_table :tournaments do |t|
      t.integer :year, null: false
      t.string :name, unique: true, null: false
      t.integer :difficulty, null: false
      t.integer :quality
      t.string :address
      t.string :type
      t.string :link

      t.timestamps
    end
    add_index :tournaments, :name
  end
end
