define([
    'anim-view',
    'hbs!templates/profile'
], function(AnimView, template) {

    return AnimView.extend({
        name: "profile",

        className: "profile",

        // default animations
        animateIn: 'bounceInUp',
        animateOut: 'slideOutDown'
    });
});