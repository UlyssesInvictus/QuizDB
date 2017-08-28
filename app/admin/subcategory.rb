ActiveAdmin.register Subcategory do
  menu priority: 5

  permit_params :name, :category_id

  config.sort_order = 'name_asc'
  config.per_page = [10, 30, 50, 100]

  scope :all, default: true

  belongs_to :category, optional: true

  index do
    selectable_column
    id_column
    column :name
    column :category, sortable: 'categories.name'
    column :created_at
    actions
  end

  filter :id
  filter :name
  filter :category, as: :check_boxes, collection: -> { Category.order(name: :asc) }

end
