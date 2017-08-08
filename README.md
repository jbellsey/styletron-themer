# Styletron Themer

Styletron Themer is a toolkit for building themable
components in React. It takes the ideas from the 
official `styletron-react` package and expands upon them.

## Requirements

You should be using React already. And if you're here,
you're probably using Styletron to manage CSS in JavaScript.
(If you're not, you should!)

## Documentation

[Full documentation can be found here](https://jbellsey.gitbooks.io/styletron-themer/).

## Installation

```bash
npm install --save styletron-themer
```

There are some unsurprising peer dependencies: 
* react
* prop-types
* styletron-utils

## Building & testing

The test suite can be run with one of two commands. The first
(test:ci) runs the tests and exits; the second (test) enters
watch mode.

```bash
npm run test:ci
npm run test
```

The files in the `dist` directory are built and committed to git.
They are generated with rollup, using the following script:

```bash
npm run build
```

You can also run the linter (`npm run lint` or `npm run lint:fix`).

The linter is run prior to any commit. If you try to commit but it seems to fail, check
your console, as there are likely to be linting errors.