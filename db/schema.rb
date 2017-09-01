# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170901024537) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pg_trgm"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_type"
    t.integer  "resource_id"
    t.string   "author_type"
    t.integer  "author_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree
  end

  create_table "admin_users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.integer  "role",                   default: 0
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.index ["confirmation_token"], name: "index_admin_users_on_confirmation_token", unique: true, using: :btree
    t.index ["email"], name: "index_admin_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true, using: :btree
  end

  create_table "bonus_parts", force: :cascade do |t|
    t.integer  "bonus_id"
    t.text     "text"
    t.text     "answer"
    t.text     "formatted_text"
    t.text     "formatted_answer"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.integer  "number",           null: false
    t.index "answer gin_trgm_ops", name: "index_bonus_parts_on_answer_gin_trgm_ops", using: :gin
    t.index "text gin_trgm_ops", name: "index_bonus_parts_on_text_gin_trgm_ops", using: :gin
    t.index ["bonus_id"], name: "index_bonus_parts_on_bonus_id", using: :btree
  end

  create_table "bonuses", force: :cascade do |t|
    t.integer  "number"
    t.string   "round"
    t.integer  "category_id"
    t.integer  "subcategory_id"
    t.integer  "quinterest_id"
    t.integer  "tournament_id"
    t.text     "leadin"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.integer  "errors_count",     default: 0
    t.text     "formatted_leadin"
    t.index "leadin gin_trgm_ops", name: "index_bonuses_on_leadin_gin_trgm_ops", using: :gin
    t.index ["category_id"], name: "index_bonuses_on_category_id", using: :btree
    t.index ["subcategory_id"], name: "index_bonuses_on_subcategory_id", using: :btree
    t.index ["tournament_id"], name: "index_bonuses_on_tournament_id", using: :btree
  end

  create_table "categories", force: :cascade do |t|
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name", unique: true, using: :btree
  end

  create_table "errors", force: :cascade do |t|
    t.text     "description",                    null: false
    t.integer  "error_type",                     null: false
    t.boolean  "resolved",       default: false
    t.string   "errorable_type"
    t.integer  "errorable_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.index ["errorable_type", "errorable_id"], name: "index_errors_on_errorable_type_and_errorable_id", using: :btree
  end

  create_table "subcategories", force: :cascade do |t|
    t.string   "name"
    t.integer  "category_id", null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["category_id"], name: "index_subcategories_on_category_id", using: :btree
    t.index ["name"], name: "index_subcategories_on_name", unique: true, using: :btree
  end

  create_table "tossups", force: :cascade do |t|
    t.text     "text",                         null: false
    t.text     "answer",                       null: false
    t.integer  "number"
    t.integer  "tournament_id"
    t.integer  "category_id"
    t.integer  "subcategory_id"
    t.string   "round"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.integer  "quinterest_id"
    t.text     "formatted_text"
    t.integer  "errors_count",     default: 0
    t.text     "formatted_answer"
    t.index "answer gin_trgm_ops", name: "index_tossups_on_answer_gin_trgm_ops", using: :gin
    t.index "text gin_trgm_ops", name: "index_tossups_on_text_gin_trgm_ops", using: :gin
    t.index ["category_id"], name: "index_tossups_on_category_id", using: :btree
    t.index ["quinterest_id"], name: "index_tossups_on_quinterest_id", unique: true, using: :btree
    t.index ["subcategory_id"], name: "index_tossups_on_subcategory_id", using: :btree
    t.index ["tournament_id"], name: "index_tossups_on_tournament_id", using: :btree
  end

  create_table "tournaments", force: :cascade do |t|
    t.integer  "year",       null: false
    t.string   "name",       null: false
    t.integer  "difficulty", null: false
    t.integer  "quality"
    t.string   "address"
    t.string   "type"
    t.string   "link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tournaments_on_name", unique: true, using: :btree
  end

  add_foreign_key "bonus_parts", "bonuses"
  add_foreign_key "bonuses", "categories"
  add_foreign_key "bonuses", "subcategories"
  add_foreign_key "bonuses", "tournaments"
  add_foreign_key "subcategories", "categories"
  add_foreign_key "tossups", "categories"
  add_foreign_key "tossups", "subcategories"
  add_foreign_key "tossups", "tournaments"
end
