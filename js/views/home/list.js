Application.CollectionView.extend({
    name: "home/list",
    initOnce: true,
    collection: Application.Collection["alerts"],
    className: 'content',

    events: {
        'ready': function(options) {
            var collection = null,
                collectionView = null;

            console.log('******************** Nested CollectionView home/list event ready was triggered!');

            // check that options are legit
            if (options.target) {
                console.debug('**Logging options for ready event on collectionView');
                console.log(options);
                collectionView = options.target;

                if (options.target.collection)
                    collection = options.target.collection;
            }

            return false;
        },

        'rendered:collection': function(collectionView, collection) {
            console.debug('Event *rendered:collection* triggered!');

            // refactoring this may work without the delay call...
            _.delay(function() {
                // initialize the mobiscroll listview plugin
                collectionView.$('ul').mobiscroll().listview({
                    theme: 'ios7',
                    swipe: 'right',
                    actions: {
                        right: [{
                            icon: 'link',
                            action: function(li, inst) {
                                alert('Linked', inst.settings.context);
                            }
                        }, {
                            icon: 'star3',
                            action: function(li, inst) {
                                alert('Rated', inst.settings.context);
                            }
                        }, {
                            icon: 'tag',
                            action: function(li, inst) {
                                alert('Tagged', inst.settings.context);
                            }
                        }, {
                            icon: 'download',
                            action: function(li, inst) {
                                alert('Downloaded', inst.settings.context);
                            }
                        }, ]
                    }
                });
            }, 0);

            return false;
        },

        // nested collection listeners
        collection: {
            'vesel:rendered': function() {
                console.log('Special vesel:rendered event triggered on the alerts collection');

                this.ensureRendered();
            },
            'rendered': function(event) {
                console.debug('CollectionView@collection:rendered event triggered!');
                console.debug('**CollectionView::collection::rendered event triggered');
                return false;
            }
        }
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/list"]()