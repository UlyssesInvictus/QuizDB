class AddFormattedQuestionParts < ActiveRecord::Migration[5.0]
  def change
    add_column :tossups, :formatted_answer, :text
    add_column :bonuses, :formatted_leadin, :text
  end
end
