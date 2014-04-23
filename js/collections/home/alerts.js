Application.Collection.extend({
  name: "home/alerts",

  url: "https://headsuphuntington.herokuapp.com/api/app/v1/alerts/",
  urlRoot: "https://headsuphuntington.herokuapp.com/api/app/v1/alerts/",

  initialize: function() {
  	console.debug("Alerts Collection initialize triggered.");

  	// refactored to prevent duplicate fetching
  	//this.fetch({ wait: true });

  	return this;
  }
});

// Instances of this collection can be created by calling:
// new Application.Collections["home/alerts"]()