class AddFormattedTextToTossups < ActiveRecord::Migration[5.0]
  def change
    add_column :tossups, :formatted_text, :text
  end
end
