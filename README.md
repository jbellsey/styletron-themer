# Styletron Themer

Styletron Themer is a toolkit for building themable
components in React. It takes the ideas from the 
official `styletron-react` package and expands upon them.

## Requirements

You should be using React already. And if you're here,
you're probably using Styltron to manage CSS in JavaScript.
(If you're not, you should!)

## Documentation

Full documentation can be found here: [TODO: gitbook link]

## Sample component

Here's how a component might look, in the simplest
reasonable case:

```js
// your component's base styles
const defaultComponentTheme = {
  border: '1px solid #aaa',
  backgroundColor: '#eee',
  padding: '8px'
};

// this function adapts your base styles to the props provided
const dynamicStyles = ({componentTheme, props}) => {
  return _.merge(
    {},
    componentTheme,
    props.color && {color: props.color}
  );
}

// use the decorator to link your component to the theming system
@stylify(defaultComponentTheme, dynamicStyles)
class Button extends React.Component {

  static propTypes = {
    color: React.PropTypes.string
  };

  // the render method does not respond to the "color" prop;
  // it lets the dynamicStyles function handle that. by the time
  // render is called, the className prop has been prepared with
  // the appropriate styletron classes
  //
  render() {
    return <div className={this.props.className}>{this.props.children}</div>;
  }
}
```

And in use, nothing special:

```js
const b = <Button color="red">Click me!</Button>;
```


## Themable

If you're building components for use in your own application -- i.e., you
are both component *designer* and component *user* -- then this aspect of
the library may not be relevant for you.

However, if your components will be usable across teams with different
needs, or even open-sourced for different organizations, then the theming
capabilities will be very interesting.

In short:

Each component's default styles can be overridden by your users. A 
component user can indicate that all Button components should have 
`padding:10px` instead of `padding:8px`. (The theme is installed when 
you instantiate your `ThemeProvider` component.)
 
A user can also manually override this value for any particular button:

```js
// sometimes you just need a little breathing room
const b = <Button inlineStyles={{marginRight:'12px'}}>Click me</Button>;
```


## Installation

```bash
npm install --save styletron-themer
```

There are some unsurprising peer dependencies: 
* react
* react-dom
* styletron
* styletron-react
* styletron-utils

And while we use lodash in many of our samples, it is not required.

