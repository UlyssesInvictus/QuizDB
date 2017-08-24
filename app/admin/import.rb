ActiveAdmin.register_page "Import" do

  content do
    render partial: "admin/tossups/import.html.erb"
  end

  page_action :force, method: :post do
    if params[:parsed_questions].present?
      # do parsing
      redirect_to admin_tossups_path, notice: 'questions added!'
    else
      # do parsing
      @parsed_questions = "stuff"
      render partial: "admin/tossups/import.html.erb"
    end
  end
end
