// ohai phantomjs, you decrepit old beast
//
import 'core-js/es5';
import 'core-js/es6';

// initialize enzyme
//
import Enzyme from 'enzyme';

// TEMP: enzyme has not updated to support the new (16.3) context api.
// see this issue:  https://github.com/airbnb/enzyme/issues/1509.
// we install a userland adapter that fixes the problem.
//
import Adapter from './src/tests/spec-helpers/react-163-adapter'; // 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

//
// loads all "*.spec.js" files in the app. used by karma.conf.js
//

const testsContext = require.context('./src', true, /spec\.js$/);
testsContext.keys().forEach(testsContext);
