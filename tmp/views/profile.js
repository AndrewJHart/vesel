define([
    'anim-view',
    'hbs!templates/profile'
], function(AnimView, template) {

    return AnimView.extend({
        name: "profile",
        template: template,

        className: "profile",

        // default animations
        animateIn: 'bounceInUp',
        animateOut: 'slideOutDown'
    });
});