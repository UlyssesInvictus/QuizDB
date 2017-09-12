ActiveAdmin.register Category do
  menu priority: 5

  permit_params :name

  config.sort_order = 'name_asc'
  config.default_per_page = 30
  config.per_page = [10, 30, 50, 100]

  scope :all, default: true

  includes :subcategories

  controller do
    def destroy
      destroy! do |success, failure|
        failure.html do
          flash[:error] = "The deletion failed because: " + resource.errors.full_messages.to_sentence
          redirect_to admin_categories_path
        end
      end
    end
  end

  show do
    attributes_table do
      row :name
      row :subcategories do |c|
        c.subcategories.map do |s|
          link_to(s.name, s, target: "_blank")
        end.join(", ").html_safe
      end
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
    column :subcategories, "Subcategories" do |c|
      c.subcategories.map(&:name).join(", ")
    end
    column :created_at
    actions
  end

  filter :id
  filter :name

end
