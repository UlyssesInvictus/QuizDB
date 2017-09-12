class AddWikipediaLinkToAnswers < ActiveRecord::Migration[5.0]
  def change
    add_column :tossups, :wikipedia_url, :text
    add_column :bonus_parts, :wikipedia_url, :text
  end
end
