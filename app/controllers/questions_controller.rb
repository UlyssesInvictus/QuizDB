class QuestionsController < ApplicationController

  def index
    render json: Question.all.to_json
  end

  private

    def question_params
      params.require(:question).permit(:text)
    end
end
