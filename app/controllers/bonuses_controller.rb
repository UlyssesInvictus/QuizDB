class BonusesController < ApplicationController
  before_action :set_bonus, only: [:show, :update, :destroy]

  # GET /bonuses
  # GET /bonuses.json
  def index
    # @bonus = Bonus.all
  end

  # GET /bonuses/1
  # GET /bonuses/1.json
  def show
  end

  # POST /bonuses
  # POST /bonuses.json
  def create
    # @bonu = Bonus.new(bonus_params)
    #
    # if @bonus.save
    #   render :show, status: :created, location: @bonus
    # else
    #   render json: @bonus.errors, status: :unprocessable_entity
    # end
  end

  # PATCH/PUT /bonuses/1
  # PATCH/PUT /bonuses/1.json
  def update
    # if @bonus.update(bonus_params)
    #   render :show, status: :ok, location: @bonus
    # else
    #   render json: @bonus.errors, status: :unprocessable_entity
    # end
  end

  # DELETE /bonuses/1
  # DELETE /bonuses/1.json
  def destroy
    # @bonus.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_bonus
      @bonus = Bonus.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def bonus_params
      params.require(:bonus).permit(:number, :round, :category_id, :subcategory_id, :quinterest_id, :tournament_id, :leadin)
    end
end
