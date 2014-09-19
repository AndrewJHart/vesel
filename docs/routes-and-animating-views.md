Routes and Animating Views with Vesel
-------------------------------------

Running the generator creates the module you pass to it, e.g. the map view, but it does not define the route or the router method to trigger your new map view. We need to **add a route to tell our app to open the map view**.

Open the `lumbar.json` file on the root path and look at the modules. Since we added the map view to a module named `home`, lumbar will create a `key:value` pair in the JSON config with a keyname of `"home"` (look near or around **line 50** for the key). It should look something like this:

```json

  "home": {
      "routes": {
          "": "index",
          "settings": "settings"
      }
  }

```

Add an extra route to `"routes"` key, something like so:

```json

  "home": {
      "routes": {
        "": "index",
        "settings": "settings",
        "map/list": "mapList"
      }
  }

```

When a link navigates to the url `http://localhost:8000/#map/list` it will trigger a match in the `routes` and the router will dispatch the `mapList` method.

Now, we have a view, template, and a route. Lets make the route create and show our new map view when the url is matched by adding a route handler in `js/routers/home.js`

Open the file and add the method `maplist` to it:

```javascript

    // home module router
    new (Backbone.Router.extend({
      routes: module.routes,

      // other route handlers/methods snipped for brevity


      // new handler for main map list view route
      mapList: function(params) {
        // create our new map view instance
        var view = new Application.Views["home/map"]({
          className: 'map'
        });

        // animate it by calling goto and passing page: "true" to our root view
        Application.goto(view, {
          page: true
        });
      }

    }));
```

You should now be able to load the app, and test the url.

You can see that the syntax `generate:view:moduleName/viewName` equates to `folder/filename`. Each folder becomes it own module during a build, allowing for separation of concerns and
doing cool things like using multiple `Backbone.Router`'s to perform **route based module loading** or **module based stylesheet loading**.


Now learn about [Tweaking the Animation View](tweaking-the-animation-view.md)
