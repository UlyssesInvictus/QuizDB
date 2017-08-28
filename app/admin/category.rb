ActiveAdmin.register Category do
  menu priority: 5

  permit_params :name

  config.sort_order = 'name_asc'
  config.per_page = [10, 30, 50, 100]

  scope :all, default: true

  includes :subcategories

  index do
    selectable_column
    id_column
    column :name
    column :subcategories, "Subcategories" do |c|
      c.subcategories.map(&:name).join(", ")
    end
    column :created_at
    actions
  end

  filter :id
  filter :name

end
