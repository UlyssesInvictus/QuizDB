Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  namespace :admin do
    resources :tournaments do
      resources :tossups
      resources :bonuses
    end
    resources :categories do
      resources :tossups
      resources :bonuses
    end
    resources :subcategories do
      resources :tossups
      resources :bonuses
    end
  end

  scope 'api', defaults: {format: 'json'} do
    resources :subcategories
    resources :categories
    resources :tournaments
    resources :tossups
    resources :bonus
    resources :errors

    get 'error_types', to: 'errors#error_types'
    get 'filter_options', to: 'quiz#filter_options'
    get 'search', to: 'tossups#search'
    get 'random', to: 'tossups#random'
    get 'stats', to: 'quiz#stats'
  end

  # When serving in production, have unmatched routes be handled by our client app
  if Rails.env.production?
    get '*path', to: "application#fallback_index_html", constraints: ->(request) do
      !request.xhr? && request.format.html?
    end
  end

end
