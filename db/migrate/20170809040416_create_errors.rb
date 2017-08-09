class CreateErrors < ActiveRecord::Migration[5.0]
  def change
    create_table :errors do |t|
      t.string :description, null: false
      t.integer :error_type, null: false
      t.boolean :resolved, default: false
      t.references :errorable, polymorphic: true, index: true

      t.timestamps
    end
  end
end
