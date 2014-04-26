Application.CollectionView.extend({
    name: "home/list",
    initOnce: true,
    collection: Application.Collection["alerts"],
    //collection: new Application.Collections["home/alerts"](),

    events: {
        'ready': function(options) {
            var collectionView,
                collection;

            console.log(options);

            // check that options are legit
            if (options.target) {
                collectionView = options.target;
                collection = options.target.collection;
            } else {
                alert('error');
                return false;
            }

            // create the nice listview stuffs
            collectionView.$el.mobiscroll().listview({
                theme: 'ios7',
                actions: [{
                    icon: 'link',
                    action: function(li, inst) {
                        notify('Linked', inst.settings.context);
                    }
                }, {
                    icon: 'star3',
                    action: function(li, inst) {
                        notify('Rated', inst.settings.context);
                    }
                }, {
                    icon: 'tag',
                    action: function(li, inst) {
                        notify('Tagged', inst.settings.context);
                    }
                }, {
                    icon: 'download',
                    action: function(li, inst) {
                        notify('Downloaded', inst.settings.context);
                    }
                }, ]
            });

            //collectionView.ensureRendered();

            return false;
        },

        'rendered:collection': function(collectionView, collection) {
            console.debug('Event *rendered:collection* triggered!');

            collectionView.$el.mobiscroll().listview({
                theme: 'ios7',
                actions: [{
                    icon: 'link',
                    action: function(li, inst) {
                        notify('Linked', inst.settings.context);
                    }
                }, {
                    icon: 'star3',
                    action: function(li, inst) {
                        notify('Rated', inst.settings.context);
                    }
                }, {
                    icon: 'tag',
                    action: function(li, inst) {
                        notify('Tagged', inst.settings.context);
                    }
                }, {
                    icon: 'download',
                    action: function(li, inst) {
                        notify('Downloaded', inst.settings.context);
                    }
                }, ]
            });

            return false;
        },

        // nested collection listeners
        collection: {
            'finished:render': function() {
                console.debug('***Finished Rendering event triggered successfully');

                this.render();
            },
            'rendered': function(event) {
                event.preventDefault();
                event.stopPropagation();
                console.debug('**CollectionView::collection::rendered event triggered');
                return false;
            }
        }
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/list"]()