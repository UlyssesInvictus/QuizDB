ActiveAdmin.register Bonus do
  menu priority: 3, label: "Bonuses"

  includes :tournament, :category, :subcategory, :bonus_parts
  belongs_to :tournament, optional: true

  permit_params :leadin,
    :tournament_id, :category_id, :subcategory_id,
    bonus_parts: [:text, :answer]

  config.sort_order = 'id_asc'
  config.per_page = [10, 30, 50, 100]

  index do
    selectable_column
    id_column
    column :content do |b|
      text_node simple_format b.content
    end
    column :tournament, sortable: 'tournaments.name'
    column :category, sortable: 'categories.name'
    column :subcategory, sortable: 'subcategories.name'
    actions
  end

  filter :id
  filter :category, as: :check_boxes
  filter :subcategory, as: :check_boxes
  filter :tournament, multiple: true
  filter :round
  filter :number
  filter :created_at, label: 'Added to QuizDB On'

end
