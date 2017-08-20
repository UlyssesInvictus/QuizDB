class AddErrorCountsToTossupAndBonus < ActiveRecord::Migration[5.0]
  def change
    add_column :tossups, :errors_count, :integer, default: 0
    add_column :bonuses, :errors_count, :integer, default: 0
  end
end
