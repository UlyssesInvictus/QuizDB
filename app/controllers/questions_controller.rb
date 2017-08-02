class QuestionsController < ApplicationController

  def index
    render json: Question.all
  end

  def search
    render json: {
      data: {
        questions: Question.all
      }
    }
  end

  private

    def question_params
      params.require(:question).permit(:text)
    end
end
