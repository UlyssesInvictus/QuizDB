ActiveAdmin.register Subcategory do
  menu priority: 5

  permit_params :name, :category_id

  config.sort_order = 'name_asc'
  config.per_page = [30, 50, 100]

  scope :all, default: true

  belongs_to :category, optional: true

  controller do
    def destroy
      destroy! do |success, failure|
        failure.html do
          flash[:error] = "The deletion failed because: " + resource.errors.full_messages.to_sentence
          redirect_to admin_subcategories_path
        end
      end
    end
  end

  show do
    attributes_table do
      row :name
      row :category
      row :num_tossups do |t|
        text_node "#{t.tossups.size}"
        a "(View)", href: admin_tournament_tossups_path(t), target: "_blank"
      end
      row :num_bonuses do |t|
        text_node "#{t.bonuses.size}"
        a "(View)", href: admin_tournament_bonuses_path(t), target: "_blank"
      end
      row :created_at
      row :updated_at
    end
    active_admin_comments
  end

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
