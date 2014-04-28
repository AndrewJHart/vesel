Vesel Framework
===============

[Vesel](https://github.com/AndrewJHart/vesel) is work in progress framework for building Single
Page Applications that are designed for mobile devices with transitions and animations baked into
the core (see AnimView). 

Vesel is currently a part of a project and a work-in-progress framework. Internally this is the base javascript project for the Heads Up webapp, but once its complete plans are to open source this to make everyones lives easier. Vesel is currently a combination of [Thorax](http://thoraxjs.org/) + [Lumbar](http://walmartlabs.github.com/lumbar).


From Zero to Hero
------------------

    git clone git://github.com/AndrewJHart/vesel

Once your clone is complete, change directories into your cloned seed and run:

    npm install

This may take a minute. Note that all of the dependencies are specific to making it easier to build, run and test your app. Once your app is written it can be deployed in any environment. Once `npm install` is finished you can start your app: 

  > Note: There is an issue with the npm registry live-reload package so if you run into issues try installing thorax-inspector separately `npm install thorax-inspector` and then run `npm start` or `grunt` -- This does **not** effect scaffolding :)

    npm start

A new window will open in your default browser with some stuff.

File Structure
--------------

- **bower.json** : Dependencies of the project, if you need to add or remove libraries from your application, edit this file
- **Gruntfile.js** : Your friendly [Grunt](http://gruntjs.com) configuration file, `npm start` will run the default task specified in this file
- **js** : All of your application code lives in here
- **lumbar.json** : A config containing all of the routes and files that compose your application
- **package.json** : Standard npm config file, only needed while still developing your app
- **public** : Will be served as the root directory by the server
- **public/modules** : Your generated application code, this folder should generally not be checked into git
- **stylesheets** : Generally speaking your styles should be application wide (in `base.css`) or split up per module
- **tasks** : Any extra grunt tasks, including the scaffolding
- **templates** : Handlebars templates, if a template shares the name / path as a view it will be auto assigned as the `template` property of the view

Scaffolding
-----------
The seed comes with some simple code generation tools that will automatically create files, folders and update your `lumbar.json` file. To run the code generation tools you first need the `grunt-cli`:

    npm install -g grunt-cli

Once you've got that installed you can run any of the following commands:

- `grunt generate:module:moduleName`
- `grunt generate:view:moduleName/viewName`
- `grunt generate:collection-view:moduleName/viewName`
- `grunt generate:model:moduleName/modelName`
- `grunt generate:collection:moduleName/collectionName`
- `grunt generate:router:moduleName`
- `grunt generate:stylesheet:moduleName`

To generate your first view we can run the generate command to simplify the process. Since we 
dont have a map view yet on this repo, you can run this command to create the map "list" view for home:

    grunt generate:view:home/map

In addition to modifying `lumbar.json` a number of files will be created:

- `js/views/home/map.js`
- `templates/home/map.handlebars`

Your view will be defined in the `/views/home/map.js` file and its template will be availbale in the 
`templates/home/map.handlebars` file. 


Routes and Animating Views
--------------------------

Running the generator creates the module you pass to it, e.g. the map view, but it does not define the route or the router method to trigger your new map view. We need to **add a route to tell our app to open the map view**.

Open the `lumbar.json` file on the root path and look at the modules. Since we added the map view to a module named `home`, lumbar will create a `key:value` pair in the JSON config with a keyname of `"home"` (look near or around **line 50** for the key). It should look something like this: 

```json

  "home": {
      "routes": {
          "": "index",
          "settings": "settings"
      },
      "scripts": [
          "js/routers/home.js",
          "js/views/home/header.js",
          "js/views/home/footer.js",
          "js/views/home/settings.js",
          "js/collections/home/alerts.js",
          "js/models/home/alert.js",
          "js/views/home/home.js",
          "js/views/home/list.js"
      ],
      "styles": [
          "stylesheets/home.css"
      ]
  },

```

Add an extra route, something like so: 

```json

  "home": {
      "routes": {
        "": "index",
        "settings": "settings",
        "map/list": "mapList"
      }
  }

```

Now any link that navigates to a url like `http://localhost:8000/#map/list` will trigger the new route. 

Now lets make the route do something when get its triggered by adding a handler in `js/routers/home.js`
Add the method `maplist` to it:

```javascript

    // home module router
    new (Backbone.Router.extend({
      routes: module.routes,
      index: function() {
        // snipped code for index view
      },

      settings: function(params) {
        // snipped code for settings view
      },

      // new handler for main map list view route
      mapList: function(params) {
        // we will create our new view here
      }

    }));
```

You can see that the syntax for generate `generate:view:moduleName/viewName' equates to `folder/filename`. Each folder becomes it own module during a build, allowing for separation of concerns and 
doing cool things like using multiple `Backbone.Router`'s to control different routing by modules. 


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

Application and Views
---------------------
The `Application` object contains a number of subclasses defined in the `js` folder:

- `js/view.js` contains `Application.View` descends from `Thorax.View`
- `js/collection.js` contains `Application.Collection` descends from `Thorax.Collection`
- `js/model.js` contains `Application.Model` descends from `Thorax.Model`

Any application specific methods can be defined in those files.

To place the first view on your page take a look at `js/views/todos/index.js`:

    Application.View.extend({
      name: "todos/index"
    });

When a view class is created with `extend` that has `name` property it will automatically be available on the `Application.Views` hash:

    Application.Views["todos/index"]

Any template with the same name will also automatically be set as the `template` property, in this case `templates/todos/index.handlebars` will be automatically set as the `template` property.

The `Application` object also serves as our root view and its `el` is already attached to the page. It is an instance of `Thorax.LayoutView` which is meant to display a single view at a time and has a `setView` method. In `js/routers/todos.js` we can call:

    index: function() {
      var view = new Application.Views["todos/index"]({});
      Application.setView(view);
    }

Update `templates/todos/index.handlebars` with some content to see that it's displaying properly.

Rendering a Collection
----------------------
To implement a todos list we need to create a collection and set it on the view. Unlike a `Backbone.View` instance a `Thorax.View` (and therefore `Application.View`) instance does not have an `options` object. All properties passed to the constructor are set on the instance and also become available inside of the handlebars template.

Our `index` method in `js/routers/todos.js` should look like:

    index: function() {
      var collection = new Application.Collection([{
        title: 'First Todo',
        done: true
      }]);
      var view = new Application.Views["todos/index"]({
        collection: collection
      });
      Application.setView(view);
    }

To display the collection we will edit `templates/todos/index.handlebars` and use the `collection` helper which will render the block for each model in the collection setting `model.attributes`  as the context inside the block. A `tag` option may be specified to define what type of HTML tag will be used when creating the collection element:

    {{#collection tag="ul"}}
      <li>{{title}}</li>
    {{/collection}}

Since we want to be able to mark our todos as done and add new ones, we will add a checkbox to each item in the collection and a form to make new items at the bottom. Our `templates/todos/index.handlebars` should now look like:

    {{#collection tag="ul"}}
      <li {{#done}}class="done"{{/done}}>
        <input type="checkbox" {{#done}}checked{{/done}}>
        {{title}}
      </li>
    {{/collection}}
    <form>
      <input name="title">
      <input type="submit" value="Add">
    </form>

Lastly add an associated style in `stylesheets/todos.css`:

    .done {
      text-decoration: line-through;
    }

View Behaviors
--------------
In order to add new items to the list we should listen to the `submit` event on `form` elements in our view. We can use the events hash in `js/views/todos/index.js`:

    "submit form": function(event) {
      event.preventDefault();
      var attrs = this.serialize();
      this.collection.add(attrs);
      this.$('input[name="title"]').val('');
    }

The `serialize` method will return a hash of all attributes in form elements on the page. Since we had an input with a name of `title` attrs will be set to: `{title: "your todo"}`. When using the `collection` helper or a `CollectionView` Thorax adds, removes and updates views in the collection as appropriate, so once we `add` a new model to the collection the view will automatically update.

    'change input[type="checkbox"]': function(event) {
      var model = $(event.target).model();
      model.set({done: event.target.checked});
    }

We also need to listen for a change in a checkbox so we can mark a model as done. Thorax extends the jQuery or Zepto `$` object with three methods: `$.view`, `$.model` and `$.collection`. They will retrieve closest bound object to an element. In this case a model was automatically bound to the `li` tag passed into the `collection` helper in the template. Now that we have a reference to the `model` we can update it and the view will automatically update.

Our finished `js/views/todos.js` file should look like:

    Application.View.extend({
      name: "todos/index",
      events: {
        "submit form": function(event) {
          event.preventDefault();
          var attrs = this.serialize();
          this.collection.add(attrs);
          this.$('input[name="title"]').val('');
        },
        'change input[type="checkbox"]': function(event) {
          var model = $(event.target).model();
          model.set({done: event.target.checked});
        }
      }
    });

And that's a finished non persistent todo list application! For a more complex todos example see the [Thorax + Lumbar TodoMVC example](https://github.com/addyosmani/todomvc/tree/gh-pages/labs/dependency-examples/thorax_lumbar)

More Seeds
----------

- [Todos](https://github.com/eastridge/thorax-seed-todos) : The project in the state at the end of the screencast (and described in this document)
- [Mocha](https://github.com/eastridge/thorax-seed-mocha) : Blank seed with a [Mocha](http://visionmedia.github.com/mocha/) test harness setup
