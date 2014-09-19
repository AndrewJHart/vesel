Modules and lumbar.json
-----------------------
A Lumbar module is composed of routes (to be passed to `Backbone.Router`s), stylesheets and JavaScripts. When a route is visited the scripts and styles associated with the module will be loaded. After running the `generate:view` task your `lumbar.json` should look like this:

    {
      "mixins": [
        "node_modules/lumbar-loader",
        "node_modules/thorax",
        "config/base.json"
      ],
      "modules": {
        "todos": {
          "routes": {},
          "scripts": [
            "js/routers/todos.js",
            "js/views/todos/index.js"
          ],
          "styles": [
            "stylesheets/todos.css"
          ]
        }
      },
      "templates": {
        "js/init.js": [
          "templates/application.handlebars"
        ]
      }
    }

`mixins` loads up the base configurations for the project. To edit what libraries (jQuery / Bootstrap, etc) are included in the project open up `bower.json`. The `templates` hash defines what templates map to a given view. An entry only needs to be added if the name of a view doesn't match the name of a template. For instance, the generator created `js/views/todos/index.js` and `templates/todos/index.js`, but it doesn't need to be defined here as the names match.

Since all routes are specified in `lumbar.json`, to create our first route it needs to be added there so we will create an empty (root) route pointing at an `index` method:

    "modules": {
      "todos": {
        "routes": {
          "": "index"
        },
        ...

In `js/routers/todos.js` we will then implement the method:

    new (Backbone.Router.extend({
      routes: module.routes,
      index: function() {

      }
    }));

Note that `module.routes` is automatically made available and will contain the hash of routes specified in `lumbar.json` for the todos module.


Now learn about [Application and Views](application-and-views.md)
