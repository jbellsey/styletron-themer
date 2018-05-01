import React from 'react';
import {getDisplayName} from './utils';
import {ThemeContext, StyletronContext} from './contexts';


const emptyThemeContext = {
  applyMiddleware: () => {},
  theme: {
    meta: {
      globalMeta: {}
    }
  }
};

export function asConsumer(RootComponent) {
  function Consumer(props) {
    return (
      <ThemeContext.Consumer>
        {themeContext => (
          <StyletronContext.Consumer>
            {styletron => (
              <RootComponent {...props}
                             themeContext = {themeContext || emptyThemeContext}
                             styletron    = {styletron || {}}
              />
            )}
          </StyletronContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );
  }

  Consumer.displayName = `Consumer_${getDisplayName(RootComponent)}`;
  return Consumer;
}
