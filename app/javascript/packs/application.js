/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

// Uncomment to copy all static images under ./images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('./images', true)
// const imagePath = (name) => images(name, true)
import Rails from "@rails/ujs";
Rails.start();

// stimulus stuff
import { Application } from "@hotwired/stimulus";

const application = Application.start();
import ImagePreviewController from "../controllers/image_preview_controller";

application.register("image-preview", ImagePreviewController);

import ReactOnRails from "react-on-rails";
import Cart from "../bundles/Cart/components/Cart";
import CartItem from "../bundles/Cart/components/CartItem";
import FlashAlerts from "../bundles/Cart/components/FlashAlerts";
import Quantity from "../bundles/Cart/components/Quantity";
import Product from "../bundles/Products/components/Product";
import ProductList from "../bundles/Products/components/ProductList";
import Totals from "../bundles/Cart/components/Totals";

ReactOnRails.register({
  Cart,
  CartItem,
  FlashAlerts,
  Quantity,
  Product,
  ProductList,
  Totals
});