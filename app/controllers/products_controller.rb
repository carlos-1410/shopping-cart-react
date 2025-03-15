# frozen_string_literal: true

class ProductsController < ApplicationController
  # rubocop:disable Lint/EmptyMethod
  def index
  end
  # rubocop:enable Lint/EmptyMethod

  def new
    @product = Product.new
  end

  def edit
    product
  end

  def create
    @product = Product.find_or_initialize_by(product_attributes.except(:image, :price_in_dollars))
    @product.price_in_dollars = product_attributes[:price_in_dollars]

    respond_to do |format|
      if @product.save
        format.html { redirect_to products_path }
      else
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if product.update(product_attributes)
        format.html { redirect_to products_path }
      else
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      format.html { redirect_to products_path } if product.destroy
    end
  end

  private

  def product
    @product ||= Product.find(params[:id])
  end

  def product_attributes
    params.require(:product).permit(:name, :vendor, :image, :price_in_dollars)
  end
end
