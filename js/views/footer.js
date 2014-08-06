define([
    'view',
    'views/modal-dialog'
    //  'hbs!templates/footer'
], function(View, ModalDialog /*, template*/ ) {

    return View.extend({
        name: "footer",
        //template: template,

        events: {
            "close:settings": function(event) {

                var headerView = this.parent.$('header').view();

                event.preventDefault();

                // call header-view to forward event & toggle its nested aside view
                headerView.toggleSettings(event);
            },

            'click a[data-toggle="modal"]': function(e) {

                e.preventDefault();

                // the modal dialog view has been clicked .. create & render
                var modal = new ModalDialog(); //.render();

                // notice the frameworks prepend call to keep aside at top of markup
                //Application.$el.append(modal.$el);

                Application.goto(modal, {
                    page: false
                    // add modal param to perform only animate in and out on same view
                });

                modal.showDialog();

                return false;
            }
        }
    });

});

// Instances of this view can be created by calling:
// new Application.Views["home/footer"]()