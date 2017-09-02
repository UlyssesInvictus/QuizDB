ActiveAdmin.register Bonus do
  menu priority: 3, label: "Bonuses"

  includes :tournament, :category, :subcategory, :bonus_parts

  controller do
    belongs_to :tournament, :category, :subcategory, optional: true
  end

  permit_params :leadin, :formatted_leadin,
    :round, :number,
    :tournament_id, :category_id, :subcategory_id,
    bonus_parts_attributes: [:id, :text, :answer,
      :formatted_text, :formatted_answer,
      :number, :_destroy]

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

  show do
    attributes_table do
      row :leadin
      row :texts do |bonus|
        simple_format bonus.bonus_parts.pluck(:text).join("\n")
      end
      row :answers do |bonus|
        simple_format bonus.bonus_parts.pluck(:answer).join("\n")
      end
      row :formatted_leadin
      row :formatted_texts do |bonus|
        simple_format (bonus.bonus_parts.pluck(:formatted_text).map do |p|
          ERB::Util.html_escape(p)
        end.join("\n"))
      end
      row :formatted_answers do |bonus|
        simple_format (bonus.bonus_parts.pluck(:formatted_answer).map do |p|
          ERB::Util.html_escape(p)
        end.join("\n"))
      end
      row :category
      row :subcategory
      row :tournament
      row :round
      row :number
      row :question_errors do |q|
        simple_format (q.question_errors.map do |e|
          "#{e.error_type}: #{e.description}"
        end).join("\n")
      end
      row :created_at
      row :updated_at
    end
    active_admin_comments
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input :category
      f.input :subcategory
      f.input :tournament
      f.input :round
      f.input :number
      f.input :leadin, input_html: { rows: 2 }
      f.input :formatted_leadin, input_html: { rows: 2 }
    end
    f.inputs do
      f.has_many :bonus_parts,
          heading: "Bonus Parts",
          sortable: :number,
          allow_destroy: true,
          sortable_start: 1 do |p|
        p.input :text, input_html: { rows: 2 }
        p.input :answer, input_html: { rows: 2 }
        p.input :formatted_text, input_html: { rows: 2 }
        p.input :formatted_answer, input_html: { rows: 2 }
      end
    end
    f.actions
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
    column :created_at
    column :updated_at

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
