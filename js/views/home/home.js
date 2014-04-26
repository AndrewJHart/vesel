Application.AnimView.extend({
    name: "home/home",
    animateIn: 'fadeIn',
    animateOut: 'iosFadeLeft',
    view: new Application.Views["home/list"](),

    onRender: function() {
        console.log('!HomePageView#onRender() triggered');

        return this;
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/home"]()