import tape from 'blue-tape';
import React from 'react';
import {miniMount} from './spec-helpers/helpers';
import Styled from '../styled';
import ThemeProvider from '../theme-provider';


// a test wants to inspect the theme passed to the dynamic style function
const dynamicStyleWatcher = renderWatcher => ({componentTheme}) => {
  renderWatcher(componentTheme);
  return componentTheme;
};

const Test1 = () => (
  <Styled
    name        = "Test1"
    staticStyle = {{color: 'blue'}}
  >
    {() => <div />}
  </Styled>
);

const Test2 = () => (
  <Styled
    name        = "Test2"
    staticStyle = {{color: 'green', meta: {charles: 'in charge'}}}
  >
    {() => <div />}
  </Styled>
);

const Test3 = ({renderWatcher}) => (
  <Styled
    name         = "Test3"
    staticStyle  = {{color: 'blue', outline: '2px dotted red'}}
    dynamicStyle = {dynamicStyleWatcher(renderWatcher)}
  >
    {() => <div />}
  </Styled>
);

// transfers a prop up to the theme
const TestThemeTransfer = ({staticStyle}) => (
  <Styled
    name        = "TestThemeTransfer"
    staticStyle = {staticStyle}
  >
    {() => <div />}
  </Styled>
);

//-----------

tape('theme provider merges themes from all child components', t => {

  const tp = miniMount(
    <ThemeProvider>
      <span>
        <Test1 />
        <span>
          <span>
            <Test2 />
          </span>
        </span>
      </span>
    </ThemeProvider>
  );

  const theme = tp.instance().theme;
  t.equal(theme.Test1.color, 'blue', 'first component should be installed into the theme');
  t.equal(theme.Test2.color, 'green', 'second component should be installed into the theme');
  t.equal(theme.Test2.meta.charles, 'in charge', 'component meta should be installed into the theme');

  t.end();
});

tape('theme provider does not override styles once a component is installed', t => {

  const tp = miniMount(
    <ThemeProvider>
      <span>
        <TestThemeTransfer staticStyle={{color: 'red'}} />
        <TestThemeTransfer staticStyle={{color: 'blue'}} />
      </span>
    </ThemeProvider>
  );

  const theme = tp.instance().theme;
  t.equal(theme.TestThemeTransfer.color, 'red', 'theme should be installed by the first component');

  t.end();
});

tape('theme provider merges user theme', t => {

  const userTheme = {Test3: {color: 'orange', fontSize: '30px'}};

  let actualStyles;

  miniMount(
    <ThemeProvider theme={userTheme}>
      <Test3 renderWatcher = {componentTheme => {actualStyles = componentTheme;}} />
    </ThemeProvider>
  );

  t.equal(actualStyles.color, 'orange', 'user-provided theme should override default component theme');
  t.equal(actualStyles.fontSize, '30px', 'user should be able to augment component theme');
  t.equal(actualStyles.outline, '2px dotted red', 'component theme should be included');

  t.end();
});

tape('theme providers nest', t => {

  const outerTheme = {Test3: {color: 'green', height: '100px'}},
        innerTheme = {Test3: {color: 'red'}},
        deepInnerTheme = {Test3: {color: 'orange'}};

  let actualOuterStyles,
      actualInnerStyles,
      actualDeepInnerStyles;

  miniMount(
    <ThemeProvider theme={outerTheme}>
      <span>
        <Test3 renderWatcher = {componentTheme => {actualOuterStyles = componentTheme;}} />
        <ThemeProvider theme={innerTheme}>
          <span>
            <Test3 renderWatcher = {componentTheme => {actualInnerStyles = componentTheme;}} />
            <ThemeProvider theme={deepInnerTheme}>
              <Test3 renderWatcher = {componentTheme => {actualDeepInnerStyles = componentTheme;}} />
            </ThemeProvider>
          </span>
        </ThemeProvider>
      </span>
    </ThemeProvider>
  );

  t.equal(actualOuterStyles.color, 'green', 'outer theme should be used for outer components');
  t.equal(actualOuterStyles.outline, '2px dotted red', 'outer theme should inherit default component theme');

  t.equal(actualInnerStyles.color, 'red', 'inner theme should be used for inner components');
  t.equal(actualInnerStyles.height, '100px', 'inner theme should inherit values from outer theme');
  t.equal(actualInnerStyles.outline, '2px dotted red', 'inner theme should inherit default component theme');

  t.equal(actualDeepInnerStyles.color, 'orange', 'deep inner theme should be used for deep inner components');
  t.equal(actualDeepInnerStyles.height, '100px', 'deep inner theme should inherit values from outer theme');

  t.end();
});
