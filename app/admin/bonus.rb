ActiveAdmin.register Bonus do
  menu priority: 3, label: "Bonuses"
  config.per_page = [30, 50, 100]
  config.create_another = true

  includes :tournament, :category, :subcategory, :bonus_parts

  controller do
    belongs_to :tournament, :category, :subcategory, optional: true
    def create
      @number = (permitted_params[:bonus][:number]&.to_i || 0)
      @tournament = permitted_params[:bonus][:tournament_id]
      @round = permitted_params[:bonus][:round]
      @category = permitted_params[:bonus][:category_id]
      @subcategory = permitted_params[:bonus][:subcategory_id]
      @bonus = Bonus.new(permitted_params[:bonus])
      if @bonus.save
        if params[:create_another] != "on"
          redirect_to admin_bonuses_path(@bonus), notice: 'Bonus was successfully created.'
        else
          @number += 1
          @bonus = Bonus.new
          flash.now[:notice] = "Bonus was successfully created."
          render :new
        end
      else
        render :new
      end
    end
  end

  permit_params :leadin, :formatted_leadin,
    :round, :number,
    :tournament_id, :category_id, :subcategory_id,
    bonus_parts_attributes: [:id, :bonus_id,
      :text, :answer,
      :formatted_text, :formatted_answer,
      :wikipedia_url,
      :number, :_destroy]

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

    # FIXME: have to manually remove default order scope b/c it fucks with AR smart updating
    Bonus.where(id: ids).reorder("").update_all(attr_hash)
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
      row :formatted_leadin do |bonus|
        text_node bonus.formatted_leadin.html_safe
      end
      row :formatted_texts do |bonus|
        simple_format (bonus.bonus_parts.pluck(:formatted_text).map do |p|
          p
        end.join("\n").html_safe)
      end
      row :formatted_answers do |bonus|
        simple_format (bonus.bonus_parts.pluck(:formatted_answer).map do |p|
          p
        end.join("\n").html_safe)
      end
      row :formatted_leadin_raw do |bonus|
        text_node bonus.formatted_leadin
      end
      row :formatted_texts_raw do |bonus|
        simple_format (bonus.bonus_parts.pluck(:formatted_text).map do |p|
          ERB::Util.html_escape(p)
        end.join("\n"))
      end
      row :formatted_answers_raw do |bonus|
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
          link_to("Error #{e.id}", admin_error_path(e)) +
          ": #{e.error_type}: #{e.description} (#{e.resolved? ? 'Resolved' : 'Unresolved'})"
        end).join("\n")
      end
      row :wikipedia_urls do |bonus|
        simple_format (bonus.bonus_parts.map do |p|
          p.link_to_wikipedia
        end.join("\n"))
      end
      row :created_at
      row :updated_at
    end
    active_admin_comments
  end

  form do |f|

    h4 "Make sure to select the 'Create Another' box for easy round uploading!"

    f.semantic_errors
    # we're okay with these being nil
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
      f.input :round, input_html: { value: round}
      f.input :number, input_html: { value: number}
      f.input :leadin, input_html: { rows: 2 }
      li do
        f.label :formatted_leadin, "Formatted leadin (rich editor)"
        div class: "quill-editor", style: "width:calc(80%);float:left;padding-bottom:30px" do
          text_node quill_generator(f, :formatted_leadin) {}
        end
      end
      f.input :formatted_leadin, hint: "Raw! You should use rich editor instead. " \
                                     "Only allowed tags are #{Tossup::ALLOWED_TAGS}" \
                                     "Any others or attributes will be auto-stripped.",
              label: "Formatted leadin (HTML)", input_html: { rows: 2 }
    end
    f.inputs do
      (3 - f.object.bonus_parts.length).times do
        f.object.bonus_parts.build
      end
      h5 "Bonus Parts"
      f.fields_for :bonus_parts do |part|
        part.inputs do
          part.input :number, as: :hidden, input_html: {value: part.index + 1}
          part.input :text, input_html: { rows: 2 }
          part.template.concat (Arbre::Context.new do
            li do
              # part.
              label "Formatted text (rich editor)", for: "bonus_bonus_parts_attributes_#{part.index}_formatted_text", class: "label"
              div class: "quill-editor", style: "width:calc(80%);float:left;padding-bottom:30px" do
                text_node quill_generator(f, "bonus_parts_attributes_#{part.index}_formatted_text".to_sym) {}
              end
            end
          end.to_s)
          part.input :formatted_text, input_html: { rows: 2 }
          part.input :answer, input_html: { rows: 2 }
          part.template.concat (Arbre::Context.new do
            li do
              # part.
              label "Formatted answer (rich editor)", for: "bonus_bonus_parts_attributes_#{part.index}_formatted_answer", class: "label"
              div class: "quill-editor", style: "width:calc(80%);float:left;padding-bottom:30px" do
                text_node quill_generator(f, "bonus_parts_attributes_#{part.index}_formatted_answer".to_sym) {}
              end
            end
          end.to_s)
          part.input :formatted_answer, label: "Formatted answer (HTML)", input_html: { rows: 2 }
          part.input :wikipedia_url, label: "Wikipedia Page Link", input_html: { rows: 1 }
        end
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

    actions defaults: false do |b|
      # force action paths to not take any potential scopes from our belongs_to's
      item "View", admin_bonus_path(b)
      text_node " "
      item "Edit", edit_admin_bonus_path(b)
      text_node " "
      text_node "<a class='delete_link member_link'
          title='Delete'
          data-confirm='Are you sure you want to delete this?'
          rel='nofollow'
          data-method='delete'
          href='#{admin_bonus_path(b)}'>
          Delete
      </a>".html_safe
      text_node " "
      item "New Error", new_from_question_admin_errors_path(errorable_id: b.id, errorable_type: "Bonus")
    end
  end

  filter :id
  filter :leadin
  filter :bonus_parts_text, as: :string, label: "Text"
  filter :bonus_parts_answer, as: :string, label: "Answers"
  filter :tournament, multiple: true, collection: -> { Tournament.order(year: :desc, name: :asc) }
  filter :category, as: :check_boxes, collection: -> { Category.select_options_by_important }
  filter :subcategory, as: :check_boxes, collection: -> { Subcategory.select_options_by_important }
  filter :round
  filter :number
  filter :errors_count
  filter :wikipedia_url
  filter :created_at, label: 'Added to QuizDB On'

end
