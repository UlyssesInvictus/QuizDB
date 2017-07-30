class QuestionsController < InheritedResources::Base

  private

    def question_params
      params.require(:question).permit(:text)
    end
end

