console.log("linked");
window.app = {
	models: {},
	views: {},
	collections: {}
};

_.extend(window.app, Backbone.Events);

$(function(){
	app.models.Friend = Backbone.Model.extend({
		urlRoot: '/friends',
		removeFriend: function(friend) {
			this.destroy();
		}
	});

	app.collections.FriendCollection = Backbone.Collection.extend({
		url: '/friends',
		model: app.models.Friend,
		initialize: function() {
			app.on('friends', this.handle_change, this);
		},
		handle_change: function(message) {
			var model;

			if(message.action === 'create') {
				this.add(message.obj); 
			}
		}
	});
	app.views.FriendView = Backbone.View.extend({
		model: app.models.Friend,
		tagName: "li",
		initialize:  function() {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "destroy", this.destroy);
		},
		template: _.template('Name: <%= first %> <%= last %> ,<button id="edit"> Edit </button>, <button id="delete"> Delete </button>'),
		events: {
			"click #edit": "update",
			"click #updateFriend": "changed",
			"click #delete": "destroy"
		},
		update: function() {
			this.$el.append($("#update-form").text());
		},
		changed: function() {
			var $first = $("#first").val();
			var $last = $("#last").val();
			this.model.set({first: $first, last: $last});
		},
		destroy: function() {
			this.model.removeFriend();		
		},
		render: function(){
			this.$el.html(this.template(this.model.attributes));
			return this;
		}
	});

	app.views.FriendCollectionView = Backbone.View.extend({
		el: $("#friend-list"),
		initialize: function(){
			this.listenTo(this.collection, "add", this.newFriend);
			this.listenTo(this.collection, "change", this.updateFriend);
			this.collection.fetch();
		},
		newFriend: function(friend) {
			var newView = new app.views.FriendView({ model: friend});
			this.$el.append(newView.render().el);
		},
		updateFriend: function(friend) {
			var newFriend = friend;
			newFriend.save();
		},
	});

	app.views.FormView = Backbone.View.extend({
		urlRoot: '/friends',
		el: $("#new-friend-form"),
		initialize: function(){
			this.$first = this.$el.find('#first');
			this.$last = this.$el.find('#last');
		},
		events: {
			"click button": 'addAFriend'
		},
		addAFriend: function(event){
			event.preventDefault();
			var friend = new app.models.Friend({
				first: this.$first.val(),
				last: this.$last.val()
			});
			newFriendCollection.create(friend);
		}
	});

	var Router = Backbone.Router.extend({
		routes: {
			"about": "aboutMe",
			"": "homepage",
			"friends": "homepage"
		},
		aboutMe: function() {
			$("#friend-list").empty();
			var $div = $("<div>");
			var $header = $("<h1>").text("About the developer");
			var $paragraph = $("<p>").text("hi my name is Ashley. asidhashdlasjdlajldajdjlasjdsilda");
			$div.append($header).append($paragraph);
			$("#friend-list").append($div);
		},
		homepage: function() {
			$("#friend-list").empty();
			 newFriendCollection = new app.collections.FriendCollection({});
			newFriendCollectionView = new app.views.FriendCollectionView({collection: newFriendCollection});
			formView = new app.views.FormView();
		}
	});

var myRouter = new Router();
 var newFriendCollection;
var newFriendCollectionView;
var formView;

Backbone.history.start();

});



