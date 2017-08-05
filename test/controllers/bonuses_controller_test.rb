require 'test_helper'

class BonusesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @bonus = bonuses(:one)
  end

  test "should get index" do
    get bonuses_url, as: :json
    assert_response :success
  end

  test "should create bonu" do
    assert_difference('bonus.count') do
      post bonuses_url, params: { bonus: { category_id: @bonus.category_id, leadin: @bonus.leadin, number: @bonus.number, quinterest_id: @bonus.quinterest_id, round: @bonus.round, subcategory_id: @bonus.subcategory_id, tournament_id: @bonus.tournament_id } }, as: :json
    end

    assert_response 201
  end

  test "should show bonu" do
    get bonus_url(@bonus), as: :json
    assert_response :success
  end

  test "should update bonu" do
    patch bonus_url(@bonus), params: { bonus: { category_id: @bonus.category_id, leadin: @bonus.leadin, number: @bonus.number, quinterest_id: @bonus.quinterest_id, round: @bonus.round, subcategory_id: @bonus.subcategory_id, tournament_id: @bonus.tournament_id } }, as: :json
    assert_response 200
  end

  test "should destroy bonu" do
    assert_difference('bonus.count', -1) do
      delete bonus_url(@bonus), as: :json
    end

    assert_response 204
  end
end
