class CreateTossups < ActiveRecord::Migration[5.0]
  def change
    create_table :tossups do |t|
      t.text :text
      t.text :answer
      t.integer :number
      t.references :tournament, foreign_key: true
      t.references :category, foreign_key: true
      t.references :subcategory, foreign_key: true
      t.string :round

      t.timestamps
    end
    add_index :tossups, :text
    add_index :tossups, :answer
    add_index :tossups, [:text, :answer]
  end
end
