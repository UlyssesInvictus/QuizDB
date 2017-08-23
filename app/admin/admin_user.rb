ActiveAdmin.register AdminUser do
  permit_params :email, :password, :password_confirmation, :role

  config.sort_order = 'email_asc'
  config.per_page = [10, 30, 50, 100]

  index do
    selectable_column
    id_column
    column :email
    column :role
    column :current_sign_in_at
    column :sign_in_count
    column :created_at
    actions
  end

  filter :email
  filter :role
  filter :current_sign_in_at
  filter :sign_in_count
  filter :created_at

  form do |f|
    f.inputs do
      f.input :email
      f.input :role, as: :select
      f.input :password
      f.input :password_confirmation
    end
    f.actions
  end

end
