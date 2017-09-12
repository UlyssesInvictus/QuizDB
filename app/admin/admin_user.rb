ActiveAdmin.register AdminUser do
  permit_params :email, :role, :password, :password_confirmation

  config.sort_order = 'confirmed_at_desc'
  config.per_page = [30, 50, 100]

  index do
    selectable_column
    id_column
    column :email
    column :role
    column :current_sign_in_at
    column :sign_in_count
    column :created_at
    column :confirmed_at
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
