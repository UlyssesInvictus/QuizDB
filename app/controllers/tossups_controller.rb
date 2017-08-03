class TossupsController < ApplicationController
  before_action :set_tossup, only: [:show, :update, :destroy]

  def search
    render json: {
      data: {
        tossups: Tossup.all
      }
    }
  end

  # GET /tossups
  # GET /tossups.json
  def index
    @tossups = Tossup.all
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

    # Never trust parameters from the scary internet, only allow the white list through.
    def tossup_params
      params.require(:tossup).permit(:text, :answer, :number, :tournament_id, :category_id, :subcategory_id, :round)
    end
end
