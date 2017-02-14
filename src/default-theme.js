import _ from 'lodash';

const baseTheme = {

  // the default styles for each component are in the component's `styles.js` file.
  // meta can have whatever you like.
  //
  meta: {
    colors: {
      // functional colors
      primary:   '#00c653',

      // "what it says on the tin" named colors
      gray0: '#000',
      gray6: '#666f74',
      grayE: '#e4eaed'
    },

    // other shared constants
    hover: {
      transitionSpeed: '150ms'
    }
  }
};

let libraryMeta = {};

export function installLibraryMeta(t) {
  libraryMeta = t;
}

export default function getDefaultTheme() {
  return _.merge({}, baseTheme, {meta: libraryMeta});
}
