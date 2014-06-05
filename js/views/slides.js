define([
  'anim-view',
  'hbs!templates/slides'
], function (AnimView, template) {
  return AnimView.extend({
    
    name: 'slides',
    template: template,

    animateIn: 'fadeIn',
    animateOut: 'slideOutLeft'
  });
});
