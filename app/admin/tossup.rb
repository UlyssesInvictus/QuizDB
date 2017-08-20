ActiveAdmin.register Tossup do
  menu priority: 2

  includes :tournament, :category, :subcategory
  belongs_to :tournament, optional: true

  permit_params :text, :answer,
    :tournament_id, :category_id, :subcategory_id

  config.sort_order = 'id_asc'
  config.per_page = [10, 30, 50, 100]

  index do
    selectable_column
    id_column
    column :text
    column :answer
    column :tournament, sortable: 'tournaments.name'
    column :category, sortable: 'categories.name'
    column :subcategory, sortable: 'subcategories.name'
    column "# Errors", :errors_count, sortable: :errors_count
    actions
  end

  filter :id
  filter :text
  filter :answer
  filter :category, as: :check_boxes
  filter :subcategory, as: :check_boxes
  filter :tournament, multiple: true
  filter :round
  filter :number
  filter :errors_count
  filter :created_at, label: 'Added to QuizDB On'

end
