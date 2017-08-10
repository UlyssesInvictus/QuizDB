class ErrorsController < ApplicationController
  before_action :set_error, only: [:show, :edit, :update, :destroy]

  def error_types
    error_types = Error.error_types.map do |k, v|
      {
        error_type: v,
        error_description: Error.error_type_description(k.to_sym)
      }
    end
    render json: error_types
  end

  # GET /errors
  # GET /errors.json
  def index
    @errors = Error.all
  end

  # GET /errors/1
  # GET /errors/1.json
  def show
  end

  # GET /errors/new
  def new
    @error = Error.new
  end

  # GET /errors/1/edit
  def edit
  end

  # POST /errors
  # POST /errors.json
  def create
    head 200 and return
    errorable_type = error_params['errorable_type'].titleize
    @error = Error.new(error_params.merge({errorable_type: errorable_type}))

    respond_to do |format|
      if @error.save
        format.html { redirect_to @error, notice: 'Error was successfully created.' }
        format.json { render :show, status: :created, location: @error }
      else
        format.html { render :new }
        format.json { render json: @error.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /errors/1
  # PATCH/PUT /errors/1.json
  def update
    # respond_to do |format|
    #   if @error.update(error_params)
    #     format.html { redirect_to @error, notice: 'Error was successfully updated.' }
    #     format.json { render :show, status: :ok, location: @error }
    #   else
    #     format.html { render :edit }
    #     format.json { render json: @error.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # DELETE /errors/1
  # DELETE /errors/1.json
  def destroy
    # @error.destroy
    # respond_to do |format|
    #   format.html { redirect_to errors_url, notice: 'Error was successfully destroyed.' }
    #   format.json { head :no_content }
    # end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_error
      @error = Error.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def error_params
      params.require(:error).permit(:description, :error_type, :resolved,
                                    :errorable_id, :errorable_type)
    end
end
