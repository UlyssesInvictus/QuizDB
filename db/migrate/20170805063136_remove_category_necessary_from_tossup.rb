class RemoveCategoryNecessaryFromTossup < ActiveRecord::Migration[5.0]
  def change
    Tossup.reset_column_information

    change_column_null :tossups, :tournament_id, true
    change_column_null :tossups, :category_id, true
    change_column_null :tossups, :subcategory_id, true
  end
end
