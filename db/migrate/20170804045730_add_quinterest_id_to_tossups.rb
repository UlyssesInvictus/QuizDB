class AddQuinterestIdToTossups < ActiveRecord::Migration[5.0]
  def change
    add_column :tossups, :quinterest_id, :integer
    add_index :tossups, :quinterest_id, unique: true
  end
end
