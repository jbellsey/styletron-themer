// install polyfills first:
//
require("native-promise-only");


//
// loads all "*.spec.js" files in the app. used by karma.conf.js
//

const testsContext = require.context('./src', true, /spec\.js$/);
testsContext.keys().forEach(testsContext);
