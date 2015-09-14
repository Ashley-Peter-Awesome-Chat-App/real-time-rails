class FriendsController < ApplicationController
	def index
		@friends = Friend.all
		render json: @friends
	end

	def show
		@friend = Friend.find(params[:id])
		render json: @friend
	end

	def create
		@friend = Friend.create(friend_params)
		render json: @friend
	end

	def update
		@friend = Friend.find(params[:id])
		@friend.update(friend_params)
		render json: @friend
	end

	def destroy
		@friend = Friend.find(params[:id])
		render json: 'delete'
	end

	private

	def friend_params
		params.permit(:first, :last)
	end
end