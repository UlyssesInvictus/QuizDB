class UpgradeQuestionContentIndices < ActiveRecord::Migration[5.0]
  def change
    remove_index :tossups, name: "index_tossups_on_answer"
    remove_index :tossups, name: "index_tossups_on_text_and_answer"
    remove_index :tossups, name: "index_tossups_on_text"

    remove_index :bonuses, name: "index_bonuses_on_leadin"

    remove_index :bonus_parts, name: "index_bonus_parts_on_answer"
    remove_index :bonus_parts, name: "index_bonus_parts_on_text"

    add_index :tossups, 'text gin_trgm_ops', using: "gin"
    add_index :tossups, 'answer gin_trgm_ops', using: "gin"
    add_index :bonuses, 'leadin gin_trgm_ops', using: "gin"
    add_index :bonus_parts, 'answer gin_trgm_ops', using: "gin"
    add_index :bonus_parts, 'text gin_trgm_ops', using: "gin"

  end
end
