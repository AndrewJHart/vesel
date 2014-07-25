define(['model'], function(Model) {
    return Model.extend({
        name: 'alerts-model',

        urlRoot: 'https://heads-up.herokuapp.com/api/app/v2/alerts/',

        url: function() {
            var id = this.get('id');

            return id ? this.urlRoot + this.id + '/' : this.urlRoot;
        }
    });
});