// main collection view for the list and list items
Application.CollectionView.extend({
    name: "home/index",
    transitionIn: 'fadeIn',
    transitionOut: 'iosFadeLeft',

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
            collectionView.$("ul.table-view").mobiscroll().listview({
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

            collectionView.ensureRendered();

            return false;
        },

        'rendered:collection': function(collectionView, collection) {
            console.debug('Event *rendered:collection* triggered!');

            collectionView.$("ul.table-view").mobiscroll().listview({
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


            // collectionView.$("ul.table-view").mobiscroll().listview({
            //     stages: [{
            //         percent: -20,
            //         color: 'red',
            //         icon: 'remove',
            //         text: 'Remove',
            //         action: function(li, inst, index) {
            //             // get the model id  (params) from DOM
            //             var model = null,
            //                 domModel = null,
            //                 params = $(li).attr('id');

            //             console.log('***TESTING $.model vs selector of id..(long way)');

            //             domModel = collectionView.$(li).model();

            //             // (for readability) see model come
            //             model = collection.get(params);

            //             if (model === domModel) {
            //                 // log it
            //                 console.debug('*MODELS ARE THE SAME! NEAT!');
            //             } else {
            //                 console.debug("*MODELS ARE NOT THE SAME?");
            //                 console.log(model);
            //                 console.log(domModel);
            //             }

            //             // prior to remove
            //             console.log('Removing li ' + li + ' with model id ' + params);

            //             // see list item go
            //             //inst.remove(li);

            //             // see model go
            //             collection.remove(model); // should trigger re-render

            //             // see spot log
            //             console.debug('Removed model: ' + model.toJSON() + ' from collection');

            //             return false;
            //         }
            //     }, {
            //         percent: 20,
            //         color: 'green',
            //         icon: 'tag',
            //         text: 'Tag',
            //         action: function(li, inst, index) {
            //             console.debug('Tagged that Motherfucker!');

            //             return false;
            //         }
            //     }],
            //     theme: 'ios7'
            // });

            // Add or look for an event "finished" so we can re-render for mobi-scroll
            // or find another way about initializing the plugin 
            // if (collectionView.initOnce) {
            //     collectionView.initOnce = false;
            //     collection.trigger('finished:render');
            // }
            //collection.trigger('finished:render');
            return false;
        },

        // nested collection listeners
        collection: {
            'finished:render': function() {
                console.debug('***Finished Rendering event triggered successfully');

                this.ensureRendered(); // ensures rendered at least once
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
// new Application.Views["home/index"]()

// home layout view
// Application.View.extend({
//     name: "home/layout"
// });