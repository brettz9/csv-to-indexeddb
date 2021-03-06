import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import istanbul from 'rollup-plugin-istanbul';

/**
 * @external RollupConfig
 * @type {PlainObject}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

// eslint-disable-next-line import/no-anonymous-default-export
export default [{
  input: 'src/index.js',
  output: {
    file: 'dist/csv-to-indexeddb.js',
    format: 'umd',
    name: 'csvToIndexeddb',
    exports: 'named'
  },
  plugins: [
    istanbul({
      exclude: ['test/**/*.js', 'dist/**']
    }),
    resolve(),
    commonjs()
  ]
}, {
  input: 'src/index.js',
  output: {
    file: 'dist/csv-to-indexeddb-es.js',
    format: 'es',
    name: 'csvToIndexeddb',
    exports: 'named'
  },
  plugins: [
    istanbul({
      exclude: ['test/**/*.js', 'dist/**']
    }),
    resolve(),
    commonjs()
  ]
}];
