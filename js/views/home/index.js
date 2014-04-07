// main collection view for the list and list items
Application.CollectionView.extend({
    name: "home/index",
    transitionIn: 'iosFadeLeft',
    transitionOut: 'iosFadeLeft',

    events: {
        'click .table-view-cell': function(event) {
            console.debug('Clicked table cell in home/index CollectionView');
        },

        // nested collection listeners
        collection: {
            'all': function() {
                console.debug('HomeRegion#index view CollectionView::events::collection listener was triggered!');
            }
        }
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/index"]()

// home layout view
Application.View.extend({
    name: "home/layout"
});