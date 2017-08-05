class CreateBonusParts < ActiveRecord::Migration[5.0]
  def change
    create_table :bonus_parts do |t|
      t.references :bonus, foreign_key: true
      t.text :text
      t.text :answer
      t.text :formatted_text
      t.text :formatted_answer

      t.timestamps
    end
    add_index :bonus_parts, :text
    add_index :bonus_parts, :answer
  end
end
