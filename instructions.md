The package has been configured successfully. We've installed the `@hotwired/turbo` and `stimulus` packages for you. You just need to include them in your `app.js` entrypoint file.

**Open the `resources/js/app.js` file and paste the following code inside**

```ts
import * as Turbo from "@hotwired/turbo";
import { Application } from "stimulus";
import { definitionsFromContext } from "stimulus/webpack-helpers";

const application = Application.start();
const context = require.context("./controllers", true, /\.js$/);
application.load(definitionsFromContext(context));

Turbo.start();
```
