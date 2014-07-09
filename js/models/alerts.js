define(['model'], function (Model) {
  return Model.extend({
    name: 'alerts-model',

    urlRoot: 'https://heads-up.herokuapp.com/api/app/v2/alerts/',

    url: function() {
    	if (this.get('id')) {
    		return this.urlRoot + this.get('id');
    	} else {
    		return this.urlroot;
    	}
    }

  });
});
