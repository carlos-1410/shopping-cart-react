# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :cart_items, only: [:index, :show, :destroy] do
        collection do
          post :upsert
          delete :reset
        end
      end
      resources :products, only: [:index, :create, :update, :destroy]
    end
  end

  get "cart", to: "cart#show"

  resources :products

  root "products#index"
end
