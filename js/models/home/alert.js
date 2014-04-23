Application.Model.extend({
  name: "home/alert", 

  //urlRoot: 'https://headsuphuntington.herokuapp.com/api/app/v1/alerts/',

  initialize: function() {
  	console.debug("Alert Model initialize triggered.");

  	return this;
  }
});

// Instances of this model can be created by calling:
// new Application.Models["home/alert"]()