define(['model'], function (Model) {
  return Model.extend({
    name: 'alerts-model',
    urlRoot: 'https://heads-up.herokuapp.com/api/app/v2/alerts/',

    url: function() {
    	id = this.get('id');

    	return this.urlRoot + id !== null ? id + '/' : ''
    }
  });
});
