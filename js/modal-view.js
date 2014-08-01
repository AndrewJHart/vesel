// base class for any view that needs to be modal popup dialog
define([
    'underscore',
    'anim-view'
], function(_, AnimView) {

    // This is the base view for which any modal views should inherit from 
    // it implements the animation methods, the showDialog() & hideDialog() 
    // methods to be inherited too. Perhaps set size-x and size-y params too
    return AnimView.extend({
        template: null,

        className: 'modal-dialog',

        animateIn: 'bounceInUp',
        animateOut: 'slideOutDown',

        initialize: function() {
            console.log('Initialized base class for modal dialog');

            return this;
        },

        showDialog: function() {
            // method to show the modal view
            this.$el.show();

            console.debug('------------------------ showDialog inherited from base class and triggered');

            return this;
        },

        hideDialog: function() {
            // hide the modal view
            this.$el.hide();

            return this;
        },

        destroyDialog: function() {
            this.remove();

            return this;
        }
    });

});