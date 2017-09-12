class QuizController < ApplicationController
  QUESTION_SEARCH_LIMIT = 15
  STATS_SEARCH_LIMIT = 500

  def filter_options
    render file: "questions/filter_options.json.jbuilder"
  end

  def stats
    questions = Question::SearchAndFilter.search_and_filter(search_params[:query],
                                                            search_params[:filters])
    tossups = questions[:tossups]
    bonuses = questions[:bonuses]

    render "questions/stats.json.jbuilder", locals: {
      tossups: tossups,
      bonuses: bonuses,
    }
  end

  private
    def search_params
      params.require(:search).permit(:query, :limit, :random,
                                    [
                                      filters: [
                                        difficulty: [], search_type: [],
                                        subcategory: [], question_type: [],
                                        tournament: [], category: []
                                      ]
                                    ])
    end
end
