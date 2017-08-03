require 'test_helper'

class TossupsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @tossup = tossups(:one)
  end

  test "should get index" do
    get tossups_url, as: :json
    assert_response :success
  end

  test "should create tossup" do
    assert_difference('tossup.count') do
      post tossups_url, params: { tossup: { answer: @tossup.answer, category_id: @tossup.category_id, number: @tossup.number, round: @tossup.round, subcategory_id: @tossup.subcategory_id, text: @tossup.text, tournament_id: @tossup.tournament_id } }, as: :json
    end

    assert_response 201
  end

  test "should show tossup" do
    get tossup_url(@tossup), as: :json
    assert_response :success
  end

  test "should update tossup" do
    patch tossup_url(@tossup), params: { tossup: { answer: @tossup.answer, category_id: @tossup.category_id, number: @tossup.number, round: @tossup.round, subcategory_id: @tossup.subcategory_id, text: @tossup.text, tournament_id: @tossup.tournament_id } }, as: :json
    assert_response 200
  end

  test "should destroy tossup" do
    assert_difference('tossup.count', -1) do
      delete tossup_url(@tossup), as: :json
    end

    assert_response 204
  end
end
