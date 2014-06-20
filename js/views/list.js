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
                var self = this;

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
                                var alert, 
                                    message, 
                                    post_msg, 
                                    post_title, 
                                    subject, 
                                    model;

                                    model = self.$(li).model();

                                    console.log(model);

                                // make the method asyncronous to avoid complications 
                                // with mobiscroll listreveal returning to default position
                                _.delay(function(li, inst) {

                                    console.log(model);

                                    post_msg = model.get('information');
                                    subject = model.get('subject');
                                    post_title = "Heads Up! " + subject;

                                    message = {
                                        title: post_title,
                                        text: post_msg,
                                        url: "http://headsupapp.io/alerts/hancock/"+model.get('id')+"/"
                                    };

                                    window.socialmessage.send(message);

                                }, 0);

                                return true;
                            }
                        }]
                    });
                }, 0);

                return false;
            }
        }
    });

});

// Instances of this view can be created by calling:
// new Application.Views["home/list"]()