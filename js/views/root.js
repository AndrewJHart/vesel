define([
    'underscore',
    'anim-view',
    'hbs!templates/root',
    'views/side-menu',
    'Hammer'
], function(_, AnimView, template, SideMenuView, Hammer) {

    // Create the Application object and root View, Application.goto(view) will
    // pass a view to the Root view to be animated or just added to the page..
    // Here we are defining the base Application "root" view class from AnimView
    var RootView = AnimView.extend({

        el: 'body',
        template: template,
        sideMenuView: null,

        // global events for all or any nested views
        events: {

            // any click event with this data-attr will trigger external url
            'nested click [data-external-url]': function(e) {

                // grab the url to be opened externally from data-external-url attr
                var url = $(e.target).data('external-url');

                console.log(e.originalContext);

                console.log('** Opening url ' + url + ' from event handler for a[data-external-url]');

                // prevent link from opening by default
                e.preventDefault();

                // force cordova to open the link in safari
                window.open(url, '_system', 'location=no');

                // return false just in case
                return false;
            }
        },

        goto: function(view, options) {
            var options = options || {},
                previous = this.currentPage || null, // cache current view
                next = view; // cache new view too

            // internal remove function to a) ensure we adhere to thorax 
            // structure b) clean-up child views c) undelegate events, etc..
            remove = _.bind(function() {
                if (previous) {
                    console.debug('RootView.goto.remove() was triggered w/ context view');
                    console.debug(this.name + " is removing: " + previous.name);

                    previous.$el && previous.$el.remove();

                    // event broadcast -- useless the way thorax has done this.
                    // todo: deprecate and refactor by extending Bacbkone.events
                    //       and trigger namespaced view events like 
                    //       "From:Root:deactivated" or something clean.
                    //triggerLifecycleEvent.call(previous, 'deactivated', options);
                    previous.triggerLifecycleEvent('deactivated', options);

                    // use inherited method to trigger thorax helper for cleaning
                    // up and removing any nested or child views
                    this._removeChild(previous);
                }
            }, this);


            if (options.page === true) {
                // Standard transitions from view to view happen here

                // check for a previous view before trying anything
                if (previous) {
                    previous.transitionOut(options, function() {

                        // only remove the old view if its not the Home view
                        if (previous.getViewName() == 'home' ||
                            previous.$el.data('view-persist') == true) {

                            // this view does not get removed
                            console.debug("Previous view " + previous.getViewName() + "'s data-view-persist is true - not removing!");

                            // although this view is not removed, provide a hook for 
                            // a user to perform cleanup, remove classes, etc.. before
                            // the next view is animated in. E.g. This hook is great for
                            // removing the effeckt-page-active class from home-vew before
                            // the map-view is rendered so that settings toggle works w/ map
                            // view too. :) :) 
                            if (_.isFunction(previous.beforeNextViewLoads)) {
                                previous.beforeNextViewLoads();
                            }
                        } else {
                            // allow user to cleanup actions pre-removal w/ this hook
                            if (_.isFunction(previous.beforeRemove)) {
                                previous.beforeRemove();
                            }

                            // remove the previous view (copied from LayoutView)
                            remove();

                            // allow user to trigger actions post-removal w/ this hook
                            if (_.isFunction(previous.afterRemove)) {
                                previous.afterRemove();
                            }
                        }
                    });
                }


                // if the new view has not already been rendered before
                // then render it and append it the dom. Otherwise we 
                // performing 2 wasteful ops here: rendering again.. but 
                // more importantly: appending an existing view to an 
                // existing DOM that has the same view...
                // This works because persistent views still exist so 
                // hasRendered will return the same value, whereas non-persistant
                // views, like detail, were removed and hasRendered will be true.
                if (!next.hasRendered()) {

                    // render the new view as a page
                    next.render({
                        page: true
                    });

                    // append new view to the body (the el for this root view)
                    this.$el.append(next.$el);
                } else {

                    // persistent view has been rendered once so we call 
                    // conservative render to trigger hooks only  
                    next.conservativeRender();
                }

                // animate the new view 
                next.transitionIn(options);

            } else { // this view is not a page/pane so apply no transitions

                // check for a previous view before acting
                if (previous) {
                    if (previous.$el.data('view-name') == 'home/home' ||
                        previous.$el.data('view-persist') == true) {

                        // even though no anim, persisting views still need callback
                        // before they are "closed" or removed from screen
                        if (_.isFunction(previous.beforeNextViewLoads)) {
                            previous.beforeNextViewLoads();
                        }

                    } else {

                        // allow user to cleanup actions pre-removal w/ this hook
                        if (_.isFunction(previous.beforeRemove)) {
                            previous.beforeRemove();
                        }

                        // remove the previous view, its children, & publish event
                        remove();

                        // allow user to trigger actions post-removal w/ this hook
                        if (_.isFunction(previous.afterRemove)) {
                            previous.afterRemove();
                        }
                    }
                }

                // render the new view
                next.render({
                    page: true // its still a "page view" just no transition hooks
                });

                // append new view to the body (or the el for the root view)
                this.$el.append(next.$el);
            }

            // assign the new view as the current view for next execution of goto
            this.currentPage = next;
        },

        initialize: function(options) {
            var self = this;

            console.log('sideMenu View instantiated');

            // configure drag options and support for side menu panel
            this.left = options.left;
            this.right = options.right;
            this.content = options.content || this.$('#home');
            this.hammer = Hammer;
            this.dragThresholdX = options.dragThresholdX || 10;

            this._rightShowing = false;
            this._leftShowing = false;
            this._isDragging = false;

            if (this.content) {
                console.debug('Content is set in initialize');
                console.dir(this.content);

                this.content.onDrag = function(e) {
                    console.debug('Drag handler triggered!!!');
                    self._handleDrag(e);
                };

                this.content.onEndDrag = function(e) {
                    self._endDrag(e);
                };
            }

            return this;
        },
        /**
         * Set the content view controller if not passed in the constructor options.
         *
         * @param {object} content
         */
        setContent: function(content) {
            var self = this;

            this.content = this.$('#home');

            this.content.onClick = function(e) {
                console.log('onClick handler triggered for home view');
                return this;
            };

            this.content.onDrag = function(e) {
                self._handleDrag(e);
            };

            this.content.endDrag = function(e) {
                self._endDrag(e);
            };
        },

        isOpenLeft: function() {
            return this.getOpenAmount() > 0;
        },

        isOpenRight: function() {
            return this.getOpenAmount() < 0;
        },

        /**
         * Toggle the left menu to open 100%
         */
        toggleLeft: function(shouldOpen) {
            var openAmount = this.getOpenAmount();
            if (arguments.length === 0) {
                shouldOpen = openAmount <= 0;
            }
            //this.content.enableAnimation();
            if (!shouldOpen) {
                this.openPercentage(0);
            } else {
                this.openPercentage(100);
            }
        },

        /**
         * Toggle the right menu to open 100%
         */
        toggleRight: function(shouldOpen) {
            var openAmount = this.getOpenAmount();
            if (arguments.length === 0) {
                shouldOpen = openAmount >= 0;
            }
            this.content.enableAnimation();
            if (!shouldOpen) {
                this.openPercentage(0);
            } else {
                this.openPercentage(-100);
            }
        },

        /**
         * Close all menus.
         */
        close: function() {
            this.openPercentage(0);
        },

        /**
         * @return {float} The amount the side menu is open, either positive or negative for left (positive), or right (negative)
         */
        getOpenAmount: function() {
            // return this.content && this.content.getTranslateX() || 0;
            return this.content && this.$('#home').view().getTranslateX() || 0;
        },

        /**
         * @return {float} The ratio of open amount over menu width. For example, a
         * menu of width 100 open 50 pixels would be open 50% or a ratio of 0.5. Value is negative
         * for right menu.
         */
        getOpenRatio: function() {
            var amount = this.getOpenAmount();
            if (amount >= 0) {
                return amount / this.left.width;
            }
            return amount / this.right.width;
        },

        isOpen: function() {
            return this.getOpenAmount() !== 0;
        },

        /**
         * @return {float} The percentage of open amount over menu width. For example, a
         * menu of width 100 open 50 pixels would be open 50%. Value is negative
         * for right menu.
         */
        getOpenPercentage: function() {
            return this.getOpenRatio() * 100;
        },

        /**
         * Open the menu with a given percentage amount.
         * @param {float} percentage The percentage (positive or negative for left/right) to open the menu.
         */
        openPercentage: function(percentage) {
            var p = percentage / 100;

            if (this.left && percentage >= 0) {
                this.openAmount(this.left.width * p);
            } else if (this.right && percentage < 0) {
                var maxRight = this.right.width;
                this.openAmount(this.right.width * p);
            }

            if (percentage !== 0) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        },

        /**
         * Open the menu the given pixel amount.
         * @param {float} amount the pixel amount to open the menu. Positive value for left menu,
         * negative value for right menu (only one menu will be visible at a time).
         */
        openAmount: function(amount) {
            var maxLeft = this.left && this.left.width || 0;
            var maxRight = this.right && this.right.width || 0;

            var content = this.$('#home').view();

            // Check if we can move to that side, depending if the left/right panel is enabled
            if (!(this.left && this.left.isEnabled) && amount > 0) {
                content.setTranslateX(0);
                return;
            }

            if (!(this.right && this.right.isEnabled) && amount < 0) {
                content.setTranslateX(0);
                return;
            }

            if (this._leftShowing && amount > maxLeft) {
                content.setTranslateX(maxLeft);
                return;
            }

            if (this._rightShowing && amount < -maxRight) {
                content.setTranslateX(-maxRight);
                return;
            }

            content.setTranslateX(amount);

            if (amount >= 0) {
                this._leftShowing = true;
                this._rightShowing = false;

                if (amount > 0) {
                    // Push the z-index of the right menu down
                    this.right && this.right.pushDown && this.right.pushDown();
                    // Bring the z-index of the left menu up
                    this.left && this.left.bringUp && this.left.bringUp();
                }
            } else {
                this._rightShowing = true;
                this._leftShowing = false;

                // Bring the z-index of the right menu up
                this.right && this.right.bringUp && this.right.bringUp();
                // Push the z-index of the left menu down
                this.left && this.left.pushDown && this.left.pushDown();
            }
        },

        /**
         * Given an event object, find the final resting position of this side
         * menu. For example, if the user "throws" the content to the right and
         * releases the touch, the left menu should snap open (animated, of course).
         *
         * @param {Event} e the gesture event to use for snapping
         */
        snapToRest: function(e) {
            // We want to animate at the end of this
            this.content.enableAnimation();
            this._isDragging = false;

            // Check how much the panel is open after the drag, and
            // what the drag velocity is
            var ratio = this.getOpenRatio();

            if (ratio === 0) {
                // Just to be safe
                this.openPercentage(0);
                return;
            }

            var velocityThreshold = 0.3;
            var velocityX = e.gesture.velocityX;
            var direction = e.gesture.direction;

            // Less than half, going left
            //if(ratio > 0 && ratio < 0.5 && direction == 'left' && velocityX < velocityThreshold) {
            //this.openPercentage(0);
            //}

            // Going right, less than half, too slow (snap back)
            if (ratio > 0 && ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
                this.openPercentage(0);
            }

            // Going left, more than half, too slow (snap back)
            else if (ratio > 0.5 && direction == 'left' && velocityX < velocityThreshold) {
                this.openPercentage(100);
            }

            // Going left, less than half, too slow (snap back)
            else if (ratio < 0 && ratio > -0.5 && direction == 'left' && velocityX < velocityThreshold) {
                this.openPercentage(0);
            }

            // Going right, more than half, too slow (snap back)
            else if (ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
                this.openPercentage(-100);
            }

            // Going right, more than half, or quickly (snap open)
            else if (direction == 'right' && ratio >= 0 && (ratio >= 0.5 || velocityX > velocityThreshold)) {
                this.openPercentage(100);
            }

            // Going left, more than half, or quickly (span open)
            else if (direction == 'left' && ratio <= 0 && (ratio <= -0.5 || velocityX > velocityThreshold)) {
                this.openPercentage(-100);
            }

            // Snap back for safety
            else {
                this.openPercentage(0);
            }
        },

        // End a drag with the given event
        _endDrag: function(e) {
            if (this._isDragging) {
                this.snapToRest(e);
            }
            this._startX = null;
            this._lastX = null;
            this._offsetX = null;
        },

        // Handle a drag event
        _handleDrag: function(e) {

            // If we don't have start coords, grab and store them
            if (!this._startX) {
                //this._startX = e.gesture.touches[0].pageX;
                this._startX = e.pointers[0].pageX;
                this._lastX = this._startX;
            } else {
                // Grab the current tap coords
                this._lastX = e.pointers[0].pageX;
                // this._lastX = e.gesture.touches[0].pageX;
            }

            // Calculate difference from the tap points
            if (!this._isDragging && Math.abs(this._lastX - this._startX) > this.dragThresholdX) {
                // if the difference is greater than threshold, start dragging using the current
                // point as the starting point
                this._startX = this._lastX;

                this._isDragging = true;
                // Initialize dragging
                //this.content.disableAnimation();
                this._offsetX = this.getOpenAmount();
            }

            if (this._isDragging) {
                this.openAmount(this._offsetX + (this._lastX - this._startX));
            }
        }

    }); // -- end of RootView class definition


    // append an instance method on the rootView object
    var instance;
    RootView.getInstance = function(target) {
        if (!instance) {
            instance = window.Application = new RootView({
                name: 'root', // will use template with name root.handlebars
                el: 'body' // force view attach directly to body vs appending div to it
            });

            instance.appendTo(target || document.body);

            // create a new child view for drag events
            instance.sideMenuView = new SideMenuView({
                el: 'div#sideMenu',
                className: 'page'
            }).render();

            var element = $('body');
            var mc = new Hammer(element.get(0));

            mc.on('press', function(e) {
                e.preventDefault();
                console.debug('Hammer received an event');
                console.dir(e);

                instance._handleDrag(e);
                instance.toggleLeft(true);
            });
        }
        return instance;
    };

    return RootView;
});