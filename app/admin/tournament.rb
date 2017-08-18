ActiveAdmin.register Tournament do
  menu priority: 3

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
    # TODO: combine this with Name and Bonuses in a single column
    column "Tossups" do |t|
      link_to "Tossups", admin_tournament_tossups_path(t)
    end
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

end
