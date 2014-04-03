Application.CollectionView.extend({
    name: "alerts/index",
    transitionIn: 'fadeIn',
    transitionOut: 'fadeOutLeft',

    events: {
        'click .table-view-cell': function(event) {
            console.debug('Clicked table cell in alerts/index CollectionView');
        },

        // nested collection listeners
        collection: {
            'all': function() {
                console.debug('CollectionView.collection listener was triggered!');
            }
        }
    }
});

// Instances of this view can be created by calling:
//new Application.Views["alerts/index"]()