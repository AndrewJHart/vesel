define([
    'modal-view',
    'hbs!templates/modal-dialog'
], function(ModalView, template) {
    return ModalView.extend({
        name: 'modal-dialog',
        template: template,

        animateIn: "fadeIn",
        animateOut: "fadeOut",

        events: {
            'click a[data-toggle="close"]': function(e) {

                e.preventDefault();

                console.debug('---- Closing the dialog ----');

                // close the dialog and destroy it
                this.hideDialog();

                this.destroyDialog();

                return false;
            }
        },

        initialize: function() {
            console.debug('Modal Dialog View Created and init triggered');

            return this;
        }
    });
});