backbone-websocket
==================

websockets mixin for backbone to be used with various services like pusher.com (pusher.js) library or with your own websockets implementation

Currently functional with pusher.com, but todo:
 -- add support for other websockets as a service type providers
 -- support for event binding to backbone model updates etc
 -- support for real-time filters that can be added on the fly to filter out what data you want to ignore or perform special ops on. This is currently implemented for django style filtering to work with tastypie or any URI that accepts filtering in the URI with a form similar to: ?name__exact=Drew&age__lte=30  
