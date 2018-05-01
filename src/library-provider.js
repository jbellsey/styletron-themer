import React from 'react';
import PropTypes from 'prop-types';
import StyletronProvider from './styletron-provider';
import ThemeProvider, {RootThemeProvider} from './theme-provider';
import {Client as StyletronClient} from 'styletron-engine-atomic';

export default function LibraryProvider(props) {

  const {
          theme,
          middlewares,
          children,
          styletron = new StyletronClient()
        }
          = props || {};

  let mw = middlewares ? [ThemeProvider.middlewares.mapColorKeys].concat(middlewares) : null;
  return (
    <RootThemeProvider theme={theme} middlewares={mw}>
      <StyletronProvider styletron={styletron}>
        {children}
      </StyletronProvider>
    </RootThemeProvider>
  );
}

LibraryProvider.propTypes = {
  theme:       PropTypes.object,
  styletron:   PropTypes.object,
  middlewares: PropTypes.array
};
