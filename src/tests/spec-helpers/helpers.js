import React from 'react';
import PropTypes from 'prop-types';
import assignDeep from 'assign-deep';
import {shallow, mount as enzymeMount} from 'enzyme';
import Styletron from 'styletron-client';
import {StyletronProvider} from 'styletron-react';
import ThemeProvider from '../../theme-provider';

//----------
// misc utilities
//

export {shallow};

// thin wrapper around the "mount" function provided by enzyme.
// all we do here is ensure that we have a router object available
//
export function mount(
  node,
  theme = null,
  {enzymeOptions, styletron} = {}
) {

  return enzymeMount(
    <StyletronProvider styletron={styletron || new Styletron()}>
      <ThemeProvider theme={theme}>
        {node}
      </ThemeProvider>
    </StyletronProvider>,

    // enzyme croaks if you pass null for options. I hate default params in es6! null
    // should mean "no thanks, this thing has no value." alas. /soapbox
    //
    enzymeOptions || undefined
  );
}

// mounts your component directly, not wrapped by Providers. this makes it possible
// to access the enzyme API, which is mostly limited to running on the root component.
// (e.g., you can't get the state or props of any component you get with "find"; you
// can only query the root node.) we do this by spoofing the context that is normally
// handled by the providers.
//
export function miniMount(node, additionalContext, additionalTypes) {
  const enzymeOptions = {
    context: assignDeep({
      styletron: {
        injectDeclaration: () => {}
      },
      themeProvider: {
        theme: {},
        installComponent: () => {},
        applyMiddleware:  () => {}
      }
    }, additionalContext),
    childContextTypes: assignDeep({
      styletron: PropTypes.object.isRequired,
      themeProvider: PropTypes.shape({
        theme:            PropTypes.object.isRequired,
        installComponent: PropTypes.func.isRequired,
        applyMiddleware:  PropTypes.func.isRequired
      }).isRequired
    }, additionalTypes)
  };

  return enzymeMount(node, enzymeOptions);
}


export function delay(ms = 1) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// turns a DOM node's attributes into an object map {class: '', id: ''}
//
export function getAttributesAsObject(node) {
  const output = {};
  [].slice.apply(node.attributes).forEach(attr => {
    output[attr.name] = attr.value;
  });
  return output;
}
