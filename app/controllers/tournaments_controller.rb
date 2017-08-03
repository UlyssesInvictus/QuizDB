class TournamentsController < ApplicationController
  before_action :set_tournament, only: [:show, :update, :destroy]
  # TODO: implement admin control on modifying methods

  # GET /tournaments
  # GET /tournaments.json
  def index
    @tournaments = Tournament.all
  end

  # GET /tournaments/1
  # GET /tournaments/1.json
  def show
  end

  # POST /tournaments
  # POST /tournaments.json
  def create
    # @tournament = Tournament.new(tournament_params)
    #
    # if @tournament.save
    #   render :show, status: :created, location: @tournament
    # else
    #   render json: @tournament.errors, status: :unprocessable_entity
    # end
  end

  # PATCH/PUT /tournaments/1
  # PATCH/PUT /tournaments/1.json
  def update
    # if @tournament.update(tournament_params)
    #   render :show, status: :ok, location: @tournament
    # else
    #   render json: @tournament.errors, status: :unprocessable_entity
    # end
  end

  # DELETE /tournaments/1
  # DELETE /tournaments/1.json
  def destroy
    # @tournament.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tournament
      @tournament = Tournament.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tournament_params
      params.require(:tournament).permit(:year, :name, :difficulty, :address, :type)
    end
end
