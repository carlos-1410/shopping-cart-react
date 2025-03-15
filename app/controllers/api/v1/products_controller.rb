# frozen_string_literal: true

module Api
  module V1
    class ProductsController < ApplicationController
      def index
        products = Product.order(created_at: :desc)

        render json: products,
               each_serializer: ::V1::ProductSerializer,
               root: "products",
               status: :ok
      end

      def destroy
        response = product.destroy_with_response

        if response.success?
          render json: { message: "Product was successfully removed!" }, status: :ok
        else
          render json: { errors: response.value }, status: :unprocessable_entity
        end
      end

      private

      def product
        @product ||= Product.find(params[:id])
      end

      def product_attributes
        params.require(:product).permit(:name, :vendor, :image, :price)
      end
    end
  end
end
