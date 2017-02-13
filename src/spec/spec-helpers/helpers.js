import React from 'react';
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
  {useMiddleware, enzymeOptions, styletron} = {}
) {

  const ourMiddlewares = useMiddleware ? [ThemeProvider.middlewares.mapColorKeys] : 0;
  return enzymeMount(
    <StyletronProvider styletron={styletron || new Styletron()}>
      <ThemeProvider theme={theme} middlewares={ourMiddlewares}>
        {node}
      </ThemeProvider>
    </StyletronProvider>,

    // enzyme croaks if you pass null for options. I hate default params in es6! null
    // should mean "no thanks, this thing has no value." alas. /soapbox
    //
    enzymeOptions || undefined
  );
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
