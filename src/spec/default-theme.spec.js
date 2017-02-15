import tape from 'blue-tape';
import getDefaultTheme from '../default-theme';

// Note: this test suite is quite overkill. but it can't hurt
// to ensure that the default theme -- even though it's meant
// to be overridden -- is well-constructed.
//

const colorRegexes = {
  hexColor3 : /^#[a-f0-9]{3}$/i,
  hexColor6 : /^#[a-f0-9]{6}$/i,
  rgbColor  : /^rgb\((\s*\d*%?\s*,){2}(\s*\d*%?\s*)\)$/,
  rgbaColor : /^rgba\((\s*\d*%?\s*,){3}(\s*[\d.]*\s*)\)$/,
  hslColor  : /^hsl\((\s*\d*%?\s*,){2}(\s*\d*%?\s*)\)$/,
  hslaColor : /^hsla\((\s*\d*%?\s*,){3}(\s*[\d.]*\s*)\)$/
};

function isColorLegit(color) {
  return Object.keys(colorRegexes).some(oneTest => {
    const re = new RegExp(colorRegexes[oneTest]);
    return re.test(color);
  });
}

// first make sure our validators look good. we're not yet testing
// actual code, just the regexes
//
tape('our color validator regexes work properly', t => {

  const tests = {
    '#faf':    true,
    '#a99':    true,
    '#77':     false,
    '#&99':    false,
    '#3456':   false,
    '#345678': true,
    '#aFb9C0': true,
    '#XXYYZZ': false,

    'rgb( 99, 100, 33)':     true,
    'rgb( 99% ,20%, 33%)':   true,
    'rgb( 99% , 0.5%, 33%)': false,
    'rgb(11,22,33)':         true,
    'rgb(11,22,33,44)':      false,

    'rgba( 99, 100, 33)':         false,
    'rgba( 99, 100, 33, 0.4)':    true,
    'rgba( 99% ,20%, 33%)':       false,
    'rgba( 99% ,20%, 33%, 0.89)': true,

    'hsl( 99, 100, 33)':     true,
    'hsl( 99% ,20%, 33%)':   true,
    'hsl( 99% , 0.5%, 33%)': false,
    'hsl(11,22,33)':         true,
    'hsl(11,22,33,44)':      false,

    'hsla( 99, 100, 33)':         false,
    'hsla( 99, 100, 33, 0.4)':    true,
    'hsla( 99% ,20%, 33%)':       false,
    'hsla( 99% ,20%, 33%, 0.89)': true
  };

  Object.keys(tests).forEach(oneColor => {
    t.equal(isColorLegit(oneColor), tests[oneColor]);
  });

  t.end();
});

tape('all colors in the default theme are legit', t => {

  const colors = getDefaultTheme().meta.colors;

  Object.keys(colors).forEach(oneColor => {
    t.equal(true, isColorLegit(colors[oneColor]), `the color ${colors[oneColor]} should validate properly`);
  });

  t.end();
});
