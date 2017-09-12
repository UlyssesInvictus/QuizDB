json.search_type ["Question", "Answer"]
json.question_type ["Tossup", "Bonus"]
# pluck to speed up query a little, instead of accessing each record
json.category Category.order(:name).pluck(:name, :id) do |c|
  json.name c[0]
  json.id c[1]
end
json.subcategory Subcategory.order(:name).pluck(:name, :id, :category_id) do |c|
    json.name c[0]
    json.id c[1]
    json.category_id c[2]
end
json.tournament Tournament.all.order(year: :desc, name: :asc)
                          .pluck(:name, :id, :difficulty, :quality, :year) do |c|
  json.name c[0]
  json.id c[1]
  json.difficulty c[2].titleize
  json.difficulty_num Tournament.difficulties[c[2]]
  json.quality c[3]
  json.year c[4]
end
json.difficulty Tournament.difficulties do |k,v|
  json.number v
  json.name k
  json.title k.titleize
end
