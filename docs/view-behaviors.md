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

More seeds can be found in our [Wiki](https://github.com/AndrewJHart/vesel/wiki/Seeds).
