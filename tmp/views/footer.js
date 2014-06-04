define([
  'view'
//  'hbs!templates/footer'
], function(View /*, template*/) {

    return View.extend({
        name: "footer",
        //template: template,
        
        events: {
            "close:settings": function(event) {

                var headerView = this.parent.$('header').view();

                event.preventDefault();

                // call header-view to forward event & toggle its nested aside view
                headerView.toggleSettings(event);
            }
        }
    });

});

// Instances of this view can be created by calling:
// new Application.Views["home/footer"]()