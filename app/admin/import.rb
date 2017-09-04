include Question::Import

ActiveAdmin.register_page "Import" do

  content do
    render file: "admin/tossups/import.html.erb", locals: {
      parse_string: nil,
      previous_params: {}
    }
  end

  controller do
    self::ACTIVE_ADMIN_ACTIONS = [:index, :force]
  end

  page_action :force, method: :post do
    import_params = params.require(:import).to_unsafe_h.symbolize_keys
    import_params.merge!({force: params[:force] == "true"})
    begin
      parsed = Question::Import.parse_yaml(import_params)
    rescue Psych::SyntaxError => e
      flash.now[:error] = "Failed to parse YAML: #{e.inspect}. Please check your formatting and try again."
      render file: "admin/tossups/import.html.erb", locals: {
        parse_string: nil,
        previous_params: params[:import].to_unsafe_h
      } and return
    rescue e
      flash.now[:error] = "Failed to upload questions due to: #{e}. Please try again, or contact owner if problem persists."
      render file: "admin/tossups/import.html.erb", locals: {
        parse_string: nil,
        previous_params: params[:import].to_unsafe_h
      } and return
    end
    parse_string = ""
    parse_string += "Num errors: #{parsed[:errors].length}\n"
    parse_string += "Errors (these will be ignored in a real parse):\n"
    parse_string += JSON.pretty_generate(parsed[:errors])
    parse_string += "\nParsed questions:\n"
    parse_string += JSON.pretty_generate(parsed[:questions])
    previous_inputs = {}
    previous_inputs.merge!(import_params.slice(:tournament_id, :category_id, :subcategory_id, :round))
    if params[:force] != "true"
      flash.now[:caution] = "Practice parse attempted: review any errors and then force upload if desired."
    elsif parsed[:errors].any?
      flash.now[:error] = "Errors still found: upload blocked. Please review and try again."
    else
      flash.now[:notice] = "Upload succeed!"
    end
    render file: "admin/tossups/import.html.erb", locals: {
      parse_string: parse_string || nil,
      previous_params: params[:import].to_unsafe_h,
      **previous_inputs
    }
  end
end
