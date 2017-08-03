class MakeTossupTextAndAnswerRequired < ActiveRecord::Migration[5.0]
  def change
    change_column :tossups, :text, :text, null: false
    change_column :tossups, :answer, :text, null: false
  end
end
