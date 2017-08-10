class ChangeErrorDescriptionFromStringToText < ActiveRecord::Migration[5.0]
  def change
    change_column :errors, :description, :text, null: false
  end
end
