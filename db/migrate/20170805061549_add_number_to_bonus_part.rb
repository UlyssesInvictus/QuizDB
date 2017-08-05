class AddNumberToBonusPart < ActiveRecord::Migration[5.0]
  def change
    add_column :bonus_parts, :number, :integer, null: false
  end
end
