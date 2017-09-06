include QuillHelper

ActiveAdmin.register Tossup do

  menu priority: 2
  config.per_page = [10, 30, 50, 100]
  config.create_another = true

  includes :tournament, :category, :subcategory

  controller do
    belongs_to :tournament, :category, :subcategory, optional: true

    def create
      @number = (permitted_params[:tossup][:number]&.to_i || 0)
      @tournament = permitted_params[:tossup][:tournament_id]
      @round = permitted_params[:tossup][:round]
      @category = permitted_params[:tossup][:category_id]
      @subcategory = permitted_params[:tossup][:subcategory_id]

      @tossup = Tossup.new(permitted_params[:tossup])
      if @tossup.save
        if params[:create_another] != "on"
          redirect_to admin_tossup_path(@tossup), notice: 'Tossup was successfully created.'
        else
          @number += 1
          @tossup = Tossup.new
          flash.now[:notice] = "Tossup was successfully created."
          render :new
        end
      else
        render :new
      end
    end
  end

  permit_params :id, :text, :answer,
    :tournament_id, :category_id, :subcategory_id,
    :round, :number, :formatted_text, :formatted_answer

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
    attr_hash[:updated_at] = Time.zone.now

    # FIXME: have to manually remove default order scope b/c it fucks with AR smart updating
    Tossup.where(id: ids).reorder("").update_all(attr_hash)
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
    # we're okay with these being nil too
    round = controller.instance_variable_get(:@round) || f.object.round
    tournament = controller.instance_variable_get(:@tournament) || f.object.tournament_id
    category = controller.instance_variable_get(:@category) || f.object.category_id
    subcategory = controller.instance_variable_get(:@subcategory) || f.object.subcategory_id
    number = controller.instance_variable_get(:@number) || 1

    f.semantic_errors
    f.inputs do
      f.input :category, collection: options_for_select(Category.select_options_by_important, category)
      f.input :subcategory, collection: options_for_select(Subcategory.select_options_by_important, subcategory)
      f.input :tournament, collection: options_for_select(Tournament.pluck(:name, :id), tournament)
      f.input :round, input_html: { value: round }
      f.input :number, input_html: { value: number }
      f.input :text, input_html: { rows: 5 }
      li do
        f.label :formatted_text, "Formatted text (rich editor)"
        div class: "quill-editor", style: "width:calc(80%);float:left;padding-bottom:30px" do
          text_node quill_generator(f, :formatted_text) {}
        end
      end
      f.input :formatted_text, hint: "Raw! You should use rich editor instead. " \
                                     "Only allowed tags are #{Tossup::ALLOWED_TAGS}" \
                                     "Any others or attributes will be auto-stripped.",
              label: "Formatted text (HTML)",
              input_html: { rows: 5 }
      f.input :answer, input_html: { rows: 2 }
      li do
        f.label :formatted_answer, "Formatted answer (rich editor)"
        div class: "quill-editor", style: "width:calc(80%);float:left;padding-bottom:30px" do
          text_node quill_generator(f, :formatted_answer) {}
        end
      end
      f.input :formatted_answer, label: "Formatted answer (HTML)", input_html: { rows: 2 }
    end
    f.actions
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
    column :created_at
    column :updated_at
    actions defaults: true do |t|
      item "New Error", new_from_question_admin_errors_path(errorable_id: t.id, errorable_type: "Tossup")
    end

  end

  filter :id
  filter :text
  filter :answer
  filter :tournament, multiple: true, collection: -> { Tournament.order(year: :desc, name: :asc) }
  filter :category, as: :check_boxes, collection: -> { Category.select_options_by_important }
  filter :subcategory, as: :check_boxes, collection: -> { Subcategory.select_options_by_important }
  filter :round
  filter :number
  filter :errors_count
  filter :created_at, label: 'Added to QuizDB On'

end
