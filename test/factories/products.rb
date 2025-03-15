# frozen_string_literal: true

FactoryBot.define do
  factory :product do
    vendor { Faker::Name.unique }
    name { "My product #{random_chars}" }
    price { 123 }
  end
end

def random_chars
  @random_chars ||= SecureRandom.hex(3)
end
