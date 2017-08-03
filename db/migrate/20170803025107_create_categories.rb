class CreateCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :categories do |t|
      t.string :name, unique: true, null: false

      t.timestamps
    end
    add_index :categories, :name, unique: true
  end
end
