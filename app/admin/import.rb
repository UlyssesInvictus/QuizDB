include Question::Import

ActiveAdmin.register_page "Import" do

  content do
    parsed_questions = nil
    if session[:parsed_questions].present?
      parsed_questions = session[:parsed_questions]
      session[:parsed_questions] = nil
    end
    render file: "admin/tossups/import.html.erb", locals: {
      parsed_questions: parsed_questions || nil
    }
    # render file: "admin/tossups/import"
  end

  controller do
    self::ACTIVE_ADMIN_ACTIONS = [:index, :force]
  end

  page_action :force, method: :post do
    Rails.logger.debug "ACTION: #{params[:action]}"
    if params[:force] == "true"
      # do parsing
      redirect_to admin_tossups_path, notice: 'questions added!'
    else
      parsed_questions = Question::Import.parse_yaml(params[:import][:questions])
      # session[:parsed_questions] = parsed_questions
      render file: "admin/tossups/import.html.erb", locals: {
        parsed_questions: parsed_questions || nil
      }
      # redirect_to admin_import_path,
      #   notice: "Questions parsed. Repeat to force import."
    end
  end
end
