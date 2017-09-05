import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      "babelrc": false,
      "exclude": 'node_modules/**',
      "presets": [
        ["es2015", {"modules": false}],
        "react",
        "stage-0"
      ],
      "plugins": [
        "transform-decorators-legacy",
        "external-helpers"
      ]
    }),
    resolve({
      extensions: [ '.js', '.json' ]
    }),
    commonjs()
  ],
  // peer deps should not be embedded
  external: id => id === 'prop-types' || /^react/.test(id) || /^styletron/.test(id),
  output: [{
    format: 'cjs',
    file:   'dist/styletron-themer.cjs.js'
  }, {
    format: 'es',
    file:   'dist/styletron-themer.es.js'
  }]
};
