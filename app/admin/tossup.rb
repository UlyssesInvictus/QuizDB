ActiveAdmin.register Tossup do

  menu priority: 2

  includes :tournament, :category, :subcategory

  controller do
    belongs_to :tournament, :category, :subcategory, optional: true
  end

  permit_params :text, :answer,
    :tournament_id, :category_id, :subcategory_id,
    :round, :number, :formatted_text, :formatted_answer

  config.sort_order = 'id_asc'
  config.per_page = [10, 30, 50, 100]
  config.create_another = true

  batch_action :bulk_edit,
    confirm: "Apply properties to all questions selected (blank inputs ignored)",
    form: {
      tournament: [["No change", nil]] + Tournament.pluck(:name, :id),
      category: [["No change", nil]] + Category.pluck(:name, :id),
      subcategory: [["No change", nil]] + Subcategory.pluck(:name, :id),
      round: :text,
      number: :number
    } do |ids, inputs|
    attr_hash = {}
    attr_hash[:tournament_id] = inputs[:tournament].to_i if inputs[:tournament].present?
    attr_hash[:category_id] = inputs[:category].to_i if inputs[:category].present?
    attr_hash[:subcategory_id] = inputs[:subcategory].to_i if inputs[:subcategory].present?
    attr_hash[:round] = inputs[:round] if inputs[:round].present?
    attr_hash[:number] = inputs[:number].to_i if inputs[:number].present?

    Tossup.where(id: ids).update_all(attr_hash)
    notice = "Tossups #{ids} updated:\n"
    notice += attr_hash.map {|k, v| "#{k}: #{v}"}.join(" ; ")
    redirect_to collection_path, notice: notice
  end

  show do
    attributes_table do
      row :text
      row :answer
      row :formatted_text
      row :formatted_answer
      row :category
      row :subcategory
      row :tournament
      row :round
      row :number
      row :created_at
      row :updated_at
    end
    active_admin_comments
  end

  index do
    selectable_column
    id_column
    column :text, sortable: :text do |t|
      text_node t.formatted_text.html_safe
    end
    column :answer, sortable: :answer do |t|
      text_node t.formatted_answer.html_safe
    end
    column :tournament, sortable: 'tournaments.name'
    column "Rd.", :round
    column "#", :number
    column "Cat.", :category, sortable: 'categories.name'
    column "Subcat.", :subcategory, sortable: 'subcategories.name'
    column "# Errors", :errors_count, sortable: :errors_count
    actions
  end

  filter :id
  filter :text
  filter :answer
  filter :tournament, multiple: true, collection: -> { Tournament.order(year: :desc, name: :asc) }
  filter :category, as: :check_boxes, collection: -> { Category.order(name: :asc) }
  filter :subcategory, as: :check_boxes, collection: -> { Subcategory.order(name: :asc) }
  filter :round
  filter :number
  filter :errors_count
  filter :created_at, label: 'Added to QuizDB On'

end
