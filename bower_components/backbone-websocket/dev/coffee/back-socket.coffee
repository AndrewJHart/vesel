# pusher based websockets mixin for backbone collection objects
#
# Note: this version is customized for Chaplin.js framework but you can 
#				remove call to Utils, Chaplin and mixin Backbone's original events
#				module instead of using EventBroker e.g. 
#							@prototype.pub = Backbone.Events.trigger
#							@prototype.sub = Backbone.Events.on

# Must include underscore.js, backbone.js then include this script. 
# Implement like so: 

# on your collection(s) class/object mixin back-socket.js - bringing sockets object methods into
# your own collection object - then simply call live() to make your collection real-time
# e.g. using underscore extend method:  _.extend(this.prototype, BackSocket.prototype) and in your
# initialize method you can check that your collection inherited the prototype chain and start back-socket
# e.g initialize: function(attr, options) { if (_.isFunction(this.live)) { this.live(); } },

	# we need options passed in and merging w/ defaults for
	#		channel, message prefix or array of messages, api-key

	# defaults object
	defaults =
		key: 'PUSHER-APP-KEY'
		channel: 'CHANNEL-NAME'
		channelSuffix: 'channel'
		messageSuffix: 'message'
		autoListen: true
		logEvents: true
		logStats: true
		# add in filters so that users can flag models that should be removed 
		filters:
	  		status: 'C'  # this would translate to api/.../1/?status=C  

	
	class BackSocket
		# mixin events object from Backbone
		_.extend @prototype, Backbone.Events

		filters: null
		settings: null
		states:
			last: null
			current: null
		logging: false
		
		live: (options) ->
			opts = options or {}

			@settings = _.defaults defaults, opts  # merge options w/ defaults

			if @settings?
				if @settings.filters? and _.isObject @settings.filters 
					@filters = @settings.filters  # assign to var
				
				@logging = @settings.logEvents
				@socketStatus() if @settings.logStats is true
				@connect() if @settings.autoListen is true

			this

		# output all info regarding pusher state
		logEventsStates: ->
			console.log 'PusherSocket#setup triggered'

			if @pusher and @logging
				@pusher.connection.bind 'state_change', (state) =>
					console.log "PusherSocket.pusher state: #{state.current}"
					@states = state
					this

			this
		
		getState: ->
			console.log "Current Pusher State: #{@pusher?.connection.state}"

			this		

		# makes Pusher informs whats going on under the hood; Added as method on 
		# actual static Pusher object instead of instantiated object -- Pusher must
		# check if .log is defined and use it as a callback if it is a function
		socketStatus: ->
			Pusher.log = (message) ->
				if console.debug_state is true
					console.log message
				else
					console.log message  # override in case we want this w/o all other app debugging

			this

		# method to ensure we are able to create pusher object
		initPusher: ->
			if not @pusher
				if @settings.key? 
					@pusher = new Pusher @settings.key
				else
					console.log 'Settings error or key not present for pusher object'

			this

		# create the data channel stream
		initChannel: ->
			if @pusher?
				@dataChannel = @pusher.subscribe "#{@settings.channel}-#{@settings.channelSuffix}"
				this
			else
				# retry by waiting 2s to ensure push is rdy
				setTimeout( =>
					console.log 'PusherSocket#initChannel Error on subscribe retrying'
					
					@pusher = new Pusher @settings.key
					@initChannel()
				, 2000)
			
			this			


		connect: ->
			console.log 'PusherSocket#connect triggered'

			@initPusher()   # create pusher object
			@initChannel()  # establish data channel

			@logEventsStates() if @logging

			console.log 'startPusher method triggered', @pusher, @dataChannel

			# bind to channels and react accordingly
			@dataChannel.bind "update_#{@settings.messageSuffix}", (data) =>
				console.log 'Broadcasting pusher Update event: ', data
				@publishEvent 'push_update', data
				@liveUpdate data
				this

			#  note the convenient coffeescript => vs -> to ensure that "this"
			#  bound the PusherSocket object instead of local function
			@dataChannel.bind "add_#{@settings.messageSuffix}", (data) =>
				console.log 'Broadcasting pusher Add event: ', data
				@publishEvent 'push_add', data
				@liveAdd data
				this


		# ---------------------------
		# Methods for modifying the collection dataset  

		# used as getter if no parameter is passed
		filters: (filters) =>
			return @filters if not filters

			# else data in param so set some properties
			if filters? and _.isObject filters
				filters = filters 
			else
				filters = {}


			@filters = _.defaults @settings.filters, filters
			console.log @filters

			this


		liveUpdate: (data) =>
      console.log "#{@constructor.name}.liveUpdate triggered"

      # look for corresponding model in collection with same id
      model = @get data.id

      if model? 
        
        		# we can actually add filters to remove
				# objects we dont want but that this sockets-mixin can't know about ahead of time! 
				# by using addFilters a user can * filter out any models that wouldn't normally come down the pipe
				# but do because of websockets (not REST). This code loops over the objects key:value pairs to test filters!
				# one can pass a key: value pair to filter -> key is model attribute to check and value is the model attribute
				# value that would want check against. That is: Filter out models with attribute status of value 'C' would be:
				# 		addFilters({status: 'C'}) and then any real-time or updated models with model.status == 'C' will be 
				# automatically removed from collection  
        if @filters?
        	for filter, value of @filters
        		if data[filter] is value
        			console.log "Model with attribute #{filter} and value #{value} was removed from collection!"
        			@remove model
        else
        	@set(model.set(data), remove: false)  # call set on model instance itself to update props
        	@trigger 'change', model
          #@set data, remove: false
        console.log 'model already exists in local collection - updating its properties.'
      else
        @set data, remove: false  # call set on collection to perform smart update
        console.log 'model was archived & is not present in local collection - updating local collection'

      this


    liveAdd: (data) =>
      console.log "#{@constructor.name}.liveAdd triggered"

      @add data
      @trigger 'add', data

      this


    liveRemove: (data) =>
      console.log "#{@constructor.name}.liveRemove Triggered"

      model = @get data.id

      if model?
        @remove model
        console.log 'removed model id: #{ data.id }'
      else
        console.log 'no model found in this collection that matches pusher data - no removal.'

      this
