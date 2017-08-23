ActiveAdmin.register_page "Import" do
  content do
    render partial: "admin/tossups/import.html.erb"
  end

  page_action :force, method: :post do
    redirect_to admin_tossups_path, notice: 'test'
  end
end
