Scaffolding
-----------
The seed comes with some simple code generation tools that will automatically create files, folders and update your `lumbar.json` file.

You can run any of the following commands to quickly create your project:

- `grunt generate:view:moduleName/viewName`
- `grunt generate:animview:moduleName/viewName`  (*Vesel Specific comes w/ default animations**)
- `grunt generate:collection-view:moduleName/viewName`
- `grunt generate:model:moduleName/modelName`
- `grunt generate:collection:moduleName/collectionName`
- `grunt generate:router:moduleName`
- `grunt generate:stylesheet:moduleName`
- `grunt generate:module:moduleName`

To generate your first view we can run the generate command to simplify the process. Since we
dont have a map view yet on this repo, you can run this command to create an animated map list view for home:

    grunt generate:anim-view:home/map

New files will be created along with updating the `lumbar.json` config and registering your new files as part of the `home` module. The wwo new file below will be present:

- `js/views/home/map.js`
- `templates/home/map.handlebars`

Since we told the generator to use the path `home`, it will automatically be available to any other javascript files in the `home` folder. Thus your new view can be found at `js/views/home/map.js` and its template will be found in
`templates/home/map.handlebars`.


Now learn about [Routes and Animating Views](routes-and-animating-views.md)
