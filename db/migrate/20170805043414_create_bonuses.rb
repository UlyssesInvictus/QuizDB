class CreateBonuses < ActiveRecord::Migration[5.0]
  def change
    create_table :bonuses do |t|
      t.integer :number
      t.string :round
      t.references :category, foreign_key: true
      t.references :subcategory, foreign_key: true
      t.integer :quinterest_id
      t.references :tournament, foreign_key: true
      t.text :leadin

      t.timestamps
    end
    add_index :bonuses, :leadin
  end
end
