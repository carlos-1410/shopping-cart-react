# frozen_string_literal: true

require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  include ApplicationHelper

  test "index" do
    get products_path
    assert_response :success
  end

  test "new" do
    get new_product_path
    assert_response :success
  end

  test "edit" do
    product = create(:product)

    get edit_product_path(product)
    assert_response :success
  end

  test "create" do
    product_params = attributes_for(:product).merge(price_in_dollars: 10.99)

    assert_difference -> { Product.count }, +1 do
      post products_path, params: { product: product_params }
    end

    assert_redirected_to products_path
  end

  test "create fails" do
    invalid_product_params = attributes_for(:product).merge(name: nil)

    assert_no_difference -> { Product.count } do
      post products_path, params: { product: invalid_product_params }
    end

    assert_response :unprocessable_entity
    assert_template :new
  end

  test "update" do
    product = create(:product)
    updated_name = "Updated Product Name"

    put product_path(product), params: { product: { name: updated_name } }

    product.reload
    assert_equal updated_name, product.name
    assert_redirected_to products_path
  end

  test "update fails" do
    product = create(:product)

    put product_path(product), params: { product: { name: nil } }

    assert_response :unprocessable_entity
    assert_template :edit
  end

  test "destroy" do
    product = create(:product)

    assert_difference -> { Product.count }, -1 do
      delete product_path(product)
    end

    assert_redirected_to products_path
  end
end
