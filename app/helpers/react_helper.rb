# frozen_string_literal: true

module ReactHelper
  def asset_path_helper(asset)
    ActionController::Base.helpers.asset_path(asset)
  end
end
