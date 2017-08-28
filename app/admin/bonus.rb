ActiveAdmin.register Bonus do
  menu priority: 3, label: "Bonuses"

  includes :tournament, :category, :subcategory, :bonus_parts
  belongs_to :tournament, optional: true

  permit_params :leadin,
    :round, :number,
    :tournament_id, :category_id, :subcategory_id,
    bonus_parts: [:text, :answer]

  config.sort_order = 'id_asc'
  config.per_page = [10, 30, 50, 100]
  config.create_another = true

  action_item :import, only: :index do
    link_to 'Import Questions', admin_import_path
  end

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

    Bonus.where(id: ids).update_all(attr_hash)
    notice = "Tossups #{ids} updated:\n"
    notice += attr_hash.map {|k, v| "#{k}: #{v}"}.join(" ; ")
    redirect_to collection_path, notice: notice
  end

  index do
    selectable_column
    id_column
    column :content do |b|
      text_node b.html_content
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
  filter :leadin
  filter :bonus_parts_text, as: :string, label: "Text"
  filter :bonus_parts_answer, as: :string, label: "Answers"
  filter :tournament, multiple: true
  filter :category, as: :check_boxes
  filter :subcategory, as: :check_boxes
  filter :round
  filter :number
  filter :errors_count
  filter :created_at, label: 'Added to QuizDB On'

end
