class RemoveQuestions < ActiveRecord::Migration[5.0]
  def change
    drop_table :questions
  end
end
