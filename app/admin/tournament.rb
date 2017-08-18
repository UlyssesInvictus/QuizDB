ActiveAdmin.register Tournament do
  permit_params :year, :name, :difficulty, :quality, :address, :link

  config.sort_order = 'year_desc'
  config.per_page = [10, 30, 50, 100]

  scope :all, default: true
  scope("High School") do |scope|
    scope.where(difficulty: [
      :regular_high_school,
      :hard_high_school,
      :national_high_school
    ])
  end
  scope("College") do |scope|
    scope.where(difficulty: [
      :easy_college,
      :regular_college,
      :hard_college
    ])
  end


  index do
    selectable_column
    id_column
    column :year
    column :name
    column :difficulty
    column :quality
    column :link
    column :created_at
    actions
  end

  filter :id
  filter :name
  filter :year
  filter :difficulty, as: :check_boxes, collection: Tournament.difficulties_titleized
  filter :quality, as: :check_boxes, collection: Tournament.qualities_titleized
  filter :created_at, label: 'Added to QuizDB On'
  filter :link

  # filter :current_sign_in_at
  # filter :sign_in_count
  # filter :created_at

  # form do |f|
  #   f.inputs do
  #     f.input :email
  #     f.input :password
  #     f.input :password_confirmation
  #   end
  #   f.actions
  # end

end
