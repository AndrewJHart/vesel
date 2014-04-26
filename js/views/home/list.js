Application.CollectionView.extend({
    name: "home/list",
    initOnce: true,
    collection: Application.Collection["alerts"],
    className: 'content',

    events: {
        'ready': function(options) {
            var collectionView,
                collection;

            console.debug('**Logging options for ready event on collectionView');
            console.log(options);

            // check that options are legit
            if (options.target) {
                collectionView = options.target;
                collection = options.target.collection;
            }

            // create the nice listview stuffs
            // collectionView.$el.mobiscroll().listview({
            //     theme: 'ios7',
            //     actions: [{
            //         icon: 'link',
            //         action: function(li, inst) {
            //             notify('Linked', inst.settings.context);
            //         }
            //     }, {
            //         icon: 'star3',
            //         action: function(li, inst) {
            //             notify('Rated', inst.settings.context);
            //         }
            //     }, {
            //         icon: 'tag',
            //         action: function(li, inst) {
            //             notify('Tagged', inst.settings.context);
            //         }
            //     }, {
            //         icon: 'download',
            //         action: function(li, inst) {
            //             notify('Downloaded', inst.settings.context);
            //         }
            //     }, ]
            // });

            //collectionView.ensureRendered();

            return false;
        },

        'rendered:collection': function(collectionView, collection) {
            console.debug('Event *rendered:collection* triggered!');

            // try delaying this?
            _.delay(function() {
                //if (!window.initOnce) {
                //  window.initOnce = true;

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
                // }
            }, 0);

            return false;
        },

        // nested collection listeners
        collection: {
            'render': function() {
                console.debug('***Finished Rendering event triggered successfully');

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