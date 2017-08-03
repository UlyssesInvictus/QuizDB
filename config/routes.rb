Rails.application.routes.draw do
  resources :tournaments
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  scope 'api' do
    resources :questions
    get 'search', to: 'questions#search'
  end

  # When serving in production, have unmatched routes be handled by our client app
  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

end
