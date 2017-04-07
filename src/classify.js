import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import {injectStylePrefixed} from 'styletron-utils';
import {getDisplayName} from './utils';

/**
 * the classify decorator is used by APPLICATION authors more than component authors.
 * it provides a "classify" function as a prop. this can be used to put styles
 * directly into HTML elements or other components that were not created with <Styled>
 *
 * @example
 *| @classify
 *| class MyComponent extends Component {
 *|    render() {
 *|      return <h2 className={this.props.classify({color: 'red'})}>Red title</h2>
 *|    }
 *| }
 */

// decorator. this is preferred over the HoC below.
// example above.
//
const classify = classifyComponent;
export default classify;

// standard HoC:
//  class MyComponent {...}
//  export classifyComponent(MyComponent)
//
export function classifyComponent(CustomComponent) {

  class ClassifiedComponent extends Component {

    // we pull context from above
    static contextTypes = {

      // from StyletronProvider (see styletron-react)
      styletron: PropTypes.object.isRequired,

      // from ThemeProvider
      themeProvider: PropTypes.shape({
        applyMiddleware: PropTypes.func.isRequired
      })
    };
    static displayName = `Classify_${getDisplayName(CustomComponent)}`;

    injectStyles = (...styletronObjects) => {
      let allStyles = _.merge({}, ...styletronObjects),
          {themeProvider} = this.context;
      if (themeProvider)
        allStyles = themeProvider.applyMiddleware(allStyles);
      return injectStylePrefixed(this.context.styletron, allStyles);
    };

    render() {
      return (
        <CustomComponent
          {...this.props}
          classify = {this.injectStyles}
        />
      );
    }
  }
  return ClassifiedComponent;
}
