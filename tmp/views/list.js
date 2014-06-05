define([
    'underscore',
    'mobiscroll',
    'collection-view',
    'hbs!templates/list',
    'hbs!templates/list-item',
    'hbs!templates/list-empty'
], function(_, mobiscroll, CollectionView, template, itemTemplate, emptyTemplate) {

    return CollectionView.extend({
        name: "list",
        template: template,
        itemTemplate: itemTemplate,
        emptyTemplate: emptyTemplate,

        // view represents the content area of its parent, the Home page-view
        className: 'content',

        // declaritive events for the view + nested declaritive events for collection
        events: {
            'rendered:collection': function(collectionView, collection) {
                console.debug('Event "rendered:collection"');

                // refactoring this may work without the delay call...
                _.delay(function() {
                    // initialize the mobiscroll listview plugin
                    collectionView.$('ul').mobiscroll().listview({
                        theme: 'ios7',
                        swipe: 'left',
                        stages: [{
                            percent: -30,
                            color: 'grey',
                            icon: 'share',
                            action: function(li, inst) {
                                inst.remove(li);
                                return false;
                            }
                        }]
                    });
                }, 0);

                return false;
            },

            // nested collection listeners
            collection: {
                'change': function() {
                    console.log('CollectionView.collection received a change event!');

                    // trigger a re-render just for testing -- this is wasteful in production
                    this.render();
                }
            }
        }
    });

});

// Instances of this view can be created by calling:
// new Application.Views["home/list"]()