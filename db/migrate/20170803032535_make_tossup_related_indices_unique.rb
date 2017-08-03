class MakeTossupRelatedIndicesUnique < ActiveRecord::Migration[5.0]
  def change
    change_column :subcategories, :category_id, :integer, null: false
    add_index :subcategories, [:name], unique: true

    change_column :tossups, :category_id, :integer, null: false
    change_column :tossups, :subcategory_id, :integer, null: false
    change_column :tossups, :tournament_id, :integer, null: false

  end
end
