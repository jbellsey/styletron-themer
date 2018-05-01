### 1.0.2
Updated `peerDependencies` to allow React 15 or 16. Either is fine.

### 1.1.0
Enabled `NODE_ENV=TEST` mode, which removes the requirment that
components be run with context (i.e., no need for a
`StyletronProvider` or `ThemeProvider`.)

# 2.0
Bumped dependencies to Styletron 4 and React 16.3.

Migration guide:

* Use our `StyletronProvider` component, rather than the one supplied
  by styletron-react.
* The outermost theme provider must be an instance of `RootThemeProvider`.
  All other (nested) providers must be `ThemeProvider`.
* Instead of manually instantiating the two providers, you can use the new
  export, `LibraryProvider`. Pass it your theme and a Styletron instance.
* You must create your own `Styletron` instance, created from
  `styletron-engine-atomic`, and pass it to the provider:
  
```js
import {Client as StyletronClient} from 'styletron-engine-atomic';

function Root({children}) {
  return (
    <LibraryProvider theme={ourTheme} styletron={new StyletronClient()}>
      {children}
    </LibraryProvider>
  );
}
```

*Everything is async*

One effect of moving to the new context API is that context is now stored
in the state of a provider component. Since state changes are async, so now
are context changes. 

Your first render of a new Styled component will always be delayed by a tick
for state changes to propagate. The second render is run immediately with
full theme support.

This may affect your ref-checking in `componentDidMount`, as the async
rendering causes refs to not be calculated on first render.

It may also affect your tests. When you mount a component in enzyme (or
your preferred test environment), the component needs a tick before it
renders properly.

Other than the above changes, upgrading to 2.0 should be largely drop-in,
as long as you provide the correct peer dependencies.
