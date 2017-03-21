import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import {injectStylePrefixed} from 'styletron-utils';
import {getDisplayName} from './utils';

/**
 * the stylable decorator is used by APPLICATION authors more than component authors.
 * it provides an "injectStyles" function as a prop. this can be used to put styles
 * directly into HTML elements or other components that were not created with @stylify
 *
 * @example
 *| @stylable
 *| class MyComponent extends Component {
 *|    render() {
 *|      return <h2 className={this.props.injectStyles({color: 'red'})}>Red title</h2>
 *|    }
 *| }
*/

// decorator. this is preferred over the HoC below.
// example above.
//
const stylable = createStylableComponent;
export default stylable;

// standard HoC:
//  class MyComponent {...}
//  export createStylableComponent(MyComponent)
//
export function createStylableComponent(CustomComponent) {

  class StylableComponent extends Component {

    // we pull context from above
    static contextTypes = {

      // from StyletronProvider (see styletron-react)
      styletron:       PropTypes.object.isRequired,

      // from ThemeProvider
      themeProvider: PropTypes.shape({
        applyMiddleware: PropTypes.func.isRequired
      })
    };
    static displayName = `Stylable_${getDisplayName(CustomComponent)}`;

    injectStyles = (...styletronObjects) => {
      let allStyles = _.merge({}, ...styletronObjects),
          {themeProvider} = this.context;
      if (themeProvider)
        allStyles = themeProvider.applyMiddleware(allStyles);
      return injectStylePrefixed(this.context.styletron, allStyles);
    };

    render() {
      // TODO: "injectStyles" prop is deprecated. use "classify"
      return (
        <CustomComponent
          {...this.props}
          injectStyles = {this.injectStyles}
          classify = {this.injectStyles}
        />
      );
    }
  }
  return StylableComponent;
}
