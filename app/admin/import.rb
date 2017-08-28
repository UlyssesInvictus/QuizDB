include Question::Import

ActiveAdmin.register_page "Import" do

  content do
    render file: "admin/tossups/import.html.erb", locals: {
      parse_string: nil
    }
    # render file: "admin/tossups/import"
  end

  controller do
    self::ACTIVE_ADMIN_ACTIONS = [:index, :force]
  end

  page_action :force, method: :post do
    parsed = Question::Import.parse_yaml(params[:import][:questions])
    parse_string = ""
    parse_string += "Num errors: #{parsed[:errors].length}\n"
    parse_string += "Errors (these will be ignored in a real parse):\n"
    parse_string += JSON.pretty_generate(parsed[:errors])
    parse_string += "\nParsed questions:\n"
    parse_string += JSON.pretty_generate(parsed[:questions])
    if params[:force] == "true"
      # do parsing
      redirect_to admin_tossups_path, notice: 'questions added!'
    else
      # session[:parsed_questions] = parsed_questions
      render file: "admin/tossups/import.html.erb", locals: {
        parse_string: parse_string || nil
      }
      # redirect_to admin_import_path,
      #   notice: "Questions parsed. Repeat to force import."
    end
  end
end
