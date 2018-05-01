import React from 'react';
import {shallow, mount as enzymeMount} from 'enzyme';
import {Server as StyletronServer} from 'styletron-engine-atomic';
import StyletronProvider from '../../styletron-provider';
import ThemeProvider from '../../theme-provider';

//----------
// misc utilities
//

export {shallow};

export function tick(ms = 1) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// thin wrapper around the "mount" function provided by enzyme.
// all we do here is ensure that we have a router object available
//
export function mount(
  node,
  theme = null,
  {enzymeOptions, styletron} = {}
) {

  const wrapper = enzymeMount(
    <StyletronProvider styletron={styletron || new StyletronServer()}>
      <ThemeProvider theme={theme}>
        {node}
      </ThemeProvider>
    </StyletronProvider>,

    // enzyme croaks if you pass null for options. I hate default params in es6! null
    // should mean "no thanks, this thing has no value." alas. /soapbox
    //
    enzymeOptions || undefined
  );

  // we call update to force a re-render, which is needed to capture the state changes inside Styled
  return tick().then(() => wrapper.update());
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
