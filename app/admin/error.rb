ActiveAdmin.register Error do
  menu priority: 6

  permit_params :description, :error_type,
    :errorable_type, :errorable_id,
    :resolved

  config.sort_order = 'id_asc'
  config.per_page = [10, 30, 50, 100]

  batch_action :resolve, if: proc {
    Ability.new(current_admin_user).can?(:update, Error)
  } do |ids|
    batch_action_collection.find(ids).each do |e|
      e.update(resolved: true)
    end
    redirect_to admin_errors_path, notice: "Errors resolved."
  end

  member_action :resolve, method: :post do
    resource.resolve!
    redirect_to admin_errors_path, notice: "Error resolved."
  end

  collection_action :new_from_question do
    @error = Error.new(errorable_id: params[:errorable_id], errorable_type: params[:errorable_type])
    render :new, layout: false
  end


  form do |f|
    h3 "Create Error (Work in Progress!!)"
    f.semantic_errors
    f.inputs do
      f.input :error_type, label: "Error Category"
      f.input :description, input_html: { rows: 4 }
      f.input :errorable_type,
              label: "Type of Question",
              as: :select, collection: ["Tossup", "Bonus"],
              hint: "Must be supplied!"
      f.input :errorable_id, label: "ID of Question",
              hint: "Must be supplied!"
      f.input :resolved
    end
    f.actions
  end

  index do
    selectable_column
    id_column
    column :resolved
    column :description
    column :error_type
    column "Question ID", sortable: :errorable_id do |e|
      if e.errorable_type == "Tossup"
        a "Tossup #{e.errorable_id}", href: admin_tossup_path(e.errorable_id)
      else
        a "Bonus #{e.errorable_id}", href: admin_bonus_path(e.errorable_id)
      end
    end
    column :updated_at
    actions defaults: false do |e|
      item "View", admin_error_path(e)
      text_node " "
      item "Resolve", resolve_admin_error_path(e), method: :post
    end
  end

  filter :id
  filter :resolved, as: :check_boxes
  filter :description
  filter :error_type, as: :check_boxes, collection: Error.error_types
  filter :errorable_id
  filter :errorable_type

end
