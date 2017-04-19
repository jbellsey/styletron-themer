import React, {Component} from 'react';
import PropTypes from 'prop-types';
import assignDeep from 'assign-deep';
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

// can be used as a decorator or HoC
//
export default function classify(CustomComponent) {

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

    classifyStyles = (...styletronObjects) => {
      let allStyles = assignDeep({}, ...styletronObjects),
          {themeProvider} = this.context;
      if (themeProvider)
        allStyles = themeProvider.applyMiddleware(allStyles);
      return injectStylePrefixed(this.context.styletron, allStyles);
    };

    render() {
      return (
        <CustomComponent
          {...this.props}
          classify = {this.classifyStyles}
        />
      );
    }
  }
  return ClassifiedComponent;
}
