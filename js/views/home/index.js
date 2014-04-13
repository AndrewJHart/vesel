// main collection view for the list and list items
Application.CollectionView.extend({
    name: "home/index",
    transitionIn: 'iosFadeLeft',
    transitionOut: 'iosFadeLeft',
    initOnce: true,

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
                return;
            }

            // create the nice listview stuffs
            collectionView.$("ul.table-view").mobiscroll().listview({
                stages: [{
                    percent: -20,
                    color: 'red',
                    icon: 'remove',
                    text: 'Remove',
                    action: function(li, inst, index) {
                        // get the model id  (params) from DOM
                        var model = null,
                            domModel = null,
                            params = $(li).attr('id');

                        console.log('***TESTING $.model vs selector of id..(long way)');

                        domModel = collectionView.$(li).model();

                        // (for readability) see model come
                        model = collection.get(params);

                        if (model === domModel) {
                            // log it
                            console.debug('*MODELS ARE THE SAME! NEAT!');
                        } else {
                            console.debug("*MODELS ARE NOT THE SAME?");
                            console.log(model);
                            console.log(domModel);
                        }

                        // prior to remove
                        console.log('Removing li ' + li + ' with model id ' + params);

                        // see list item go
                        //inst.remove(li);

                        // see model go
                        collection.remove(model); // should trigger re-render

                        // see spot log
                        console.debug('Removed model: ' + model.toJSON() + ' from collection');

                        return false;
                    }
                }, {
                    percent: 20,
                    color: 'green',
                    icon: 'tag',
                    text: 'Tag',
                    action: function(li, inst, index) {
                        console.debug('Tagged that Motherfucker!');

                        return false;
                    }
                }],
                theme: 'ios7'
            });

            collection.trigger("finished:render");
        },

        'rendered:collection': function(collectionView, collection) {
            console.debug('Event *rendered:collection* triggered!');

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
            return false;
        },

        // nested collection listeners
        collection: {
            'change': function() {
                console.debug('CollectionView::collection::change triggered');
            },
            'remove': function() {
                console.debug('CollecitonView::collection::remove Triggered');

                // this refers to the view :) :)  very handy..
                this.render();
            },
            'finished:render': function() {
                console.debug('***Finished Rendering event triggered successfully');

                this.render();
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