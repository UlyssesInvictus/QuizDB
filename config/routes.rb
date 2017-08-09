Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  scope 'api' do
    resources :subcategories
    resources :categories
    resources :tournaments
    resources :tossups
    resources :bonus
    resources :errors

    get 'filter_options', to: 'tossups#filter_options'
    get 'search', to: 'tossups#search'
    get 'random', to: 'tossups#random'
  end

  # When serving in production, have unmatched routes be handled by our client app
  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

end
