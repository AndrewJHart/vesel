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


Now learn about [Rendering a Collection](rendering-a-collection.md)
