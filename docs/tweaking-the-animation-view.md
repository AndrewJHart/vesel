Tweaking the Animation View
---------------------------

If you want to modify the view's transition animations you must modify the 2 properties `animateIn` and `animateOut` in your definition.

Open `js/views/home/map.js` and you should something similar to this:

```javascript

  Application.AnimView.extend({  // update to extend AnimView
    name: "home/map",

    // add class names we need
    className: 'map left',

    // add the animate in and out classes
    animateIn: 'fadeIn',
    animateOut: 'fadeOut'
});

```

You can tweak the `className` to add any css classes onto the views outermost element. You can also tweak the animate properties to match any **css classes that are defined for transitions**

Since you always have access to the root `Application` object you can create new view instances easily from anywhere within the application.
You can always access all objects by their name through the **root** view object via the `Registry`. Thus, we can create the new view like this:

  `new Application.Views["home/map"]();`

or with properties passed to the view like so:

  `new Application.Views["home/map"]({
      className: 'map list ...',
      foo: 'bar'
  });`

You can also assign instances to the `Thorax.Registry` by using the non-plural registry accessor e.g. `View` instead of `Views` like this:

  ```javascript
    // we will use the view var locally and use Application.View[] non-locally
    var view = Application.View["map"] = new Application.Views["home/map"]();
  ```

Once a view has been instantiated that way, its instance can be accessed from anywhere -including other modules- like so:

  ```javascript

    // Get our map view after it has been created in another view or module
    var existingMapView = Application.View["map"];

  ```

  This makes it easy to create a view when a route is triggered, but also access it from some other module in the app to update the existing instance.

  > The `Application` object serves as our root view and has its element `el` attached directly to the **body** of the document. It is an instance of `RootView` which is meant to display one page at at time - with each page containing as many views as needed e.g. header, content, footer in the home page view. (This is similar to the Thorax.LayoutView except cooler)



Add some markup to your handlebars template in `templates/home/map.handlebars` -- whatever you want for now.

Thats it. Navigate to that route and it will animate your view in and load whatever you have in your handlebars `template`.


Everything else below is documentation on the Thorax seed and info regarding helpers, etc..


Now learn about [Modules and Lumbar.json](modules-and-lumbar.md)
