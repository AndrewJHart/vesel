Application.View.extend({
    name: "home/footer",

    events: {
        "close:settings": function(event) {

            var headerView = this.parent.$('header').view();
            // headerView = this.parent.children[this.parent.$('header').data('view-cid')],
            // ----------
            // NOTE: the long, unreadable call thats commented out is actually twice 
            //       as fast as the shorter one above it that is being used. The difference
            // 			 on my iMac is 0.05ms vs 0.14ms approx. Thus, seems like readability
            //			 is worth the sacrifice here.


            event.preventDefault();

            // call header-view to forward event & toggle its nested aside view
            headerView.toggleSettings(event);


            // no need to use bind w/ _.delay b/c any args minus first 2 (func, wait) 
            // are passed to the callback func in a wrapped setTimeout w/ func.apply
            // tl;dr - delay creates a closure wrapping setTimeout so extra args are
            // 				 useable within the function.
            //------------------------------------ PERF TESTING --------------------
            // _.delay(function(_this) {
            //     headerViewProfile1 = null,
            //     headerViewProfile2 = null;

            //     console.debug('---------------- profile analysis ---------------');

            //     console.profile('profile parent.children[this.parent.$("header").data("..")] call');
            //     headerViewProfile1 = _this.parent.children[_this.parent.$('header').data('view-cid')];
            //     console.profileEnd();

            //     console.profile('profile this.parent.$("header").view() call');
            //     headerViewProfile2 = _this.parent.$('header').view();
            //     console.profileEnd();

            //     console.debug('---------------- performance analysis ---------------');

            //     console.time("Access short code to get header-view");
            //     var testView2 = _this.parent.$('header').view();
            //     console.timeEnd("Access short code to get header-view");

            //     console.log('\n');

            //     console.time("Access lengthy code to get header-view");
            //     var testView = _this.parent.children[_this.parent.$('header').data('view-cid')];
            //     console.timeEnd("Access lengthy code to get header-view");

            // }, 2000, this);

        }
    }
});

// Instances of this view can be created by calling:
// new Application.Views["home/footer"]()