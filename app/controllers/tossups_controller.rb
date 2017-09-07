class TossupsController < ApplicationController
  before_action :set_tossup, only: [:show, :update, :destroy]

  QUESTION_SEARCH_LIMIT = 15

  def random
    # pretty much identical to search
    query = search_params[:query]
    filters = search_params[:filters]
    # except we ignore the limit param
    # limit = search_params[:limit].blank? || search_params[:limit] != 'false'

    questions = Question::SearchAndFilter.search_and_filter(query, filters)
    # and define our own limit here
    random_limit = search_params[:random]&.to_i || 10
    # note that the RANDOM() is postgres specific
    tossups = questions[:tossups].reorder("RANDOM()").limit(random_limit)
    bonuses = questions[:bonuses].reorder("RANDOM()").limit(random_limit)

    render "search.json.jbuilder", locals: {
      tossups: tossups,
      num_tossups_found: tossups.size,
      bonuses: bonuses,
      num_bonuses_found: bonuses.size
    }
  end

  def search
    query = search_params[:query]
    filters = search_params[:filters]
    limit = search_params[:limit].blank? || search_params[:limit] != 'false'
    # default to downloading all, but can potentially use limit as well
    limit = false if params[:download]

    questions = Question::SearchAndFilter.search_and_filter(query, filters)
    tossups = questions[:tossups]
    bonuses = questions[:bonuses]

    locals = {
      tossups: limit ? tossups.limit(QUESTION_SEARCH_LIMIT) : tossups,
      num_tossups_found: tossups.size,
      bonuses: limit ? bonuses.limit(QUESTION_SEARCH_LIMIT) : bonuses,
      num_bonuses_found: bonuses.size
    }

    if params[:download] == 'json'
      json_file = view_context.render file: "tossups/search.json.jbuilder", locals: locals
      # turn the string back into a json object with the files we want
      # then prettify it
      send_data JSON.pretty_generate(JSON.parse(json_file)),
        filename: "quizdb-#{DateTime.now.to_s(:number)}.json",
        type: 'application/json'
    elsif params[:download] == 'text'
      text_file = view_context.render file: "tossups/search.txt.erb", locals: locals
      send_data text_file,
        filename: "quizdb-#{DateTime.now.to_s(:number)}.txt",
        type: 'text/plain'

    else
      render file: "tossups/search.json.jbuilder", locals: locals
    end

  end

  # GET /tossups
  # GET /tossups.json
  def index
    # @tossups = Tossup.all
  end

  # GET /tossups/1
  # GET /tossups/1.json
  def show
  end

  # POST /tossups
  # POST /tossups.json
  def create
    # @tossup = tossup.new(tossup_params)
    #
    # if @tossup.save
    #   render :show, status: :created, location: @tossup
    # else
    #   render json: @tossup.errors, status: :unprocessable_entity
    # end
  end

  # PATCH/PUT /tossups/1
  # PATCH/PUT /tossups/1.json
  def update
    # if @tossup.update(tossup_params)
    #   render :show, status: :ok, location: @tossup
    # else
    #   render json: @tossup.errors, status: :unprocessable_entity
    # end
  end

  # DELETE /tossups/1
  # DELETE /tossups/1.json
  def destroy
    # @tossup.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tossup
      @tossup = Tossup.find(params[:id])
    end

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

    # Never trust parameters from the scary internet, only allow the white list through.
    def tossup_params
      params.require(:tossup).permit(:text, :answer, :number, :tournament_id,
                                     :category_id, :subcategory_id, :round)
    end
end
