// rollup.config.js
import pnp from 'rollup-plugin-pnp-resolve';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'src/index.umd.js',
    output: {
      file: pkg.main,
      name: 'ChartGraphsDagre',
      format: 'umd',
      globals: {
        'chart.js': 'Chart',
        'chartjs-chart-graph': 'ChartGraphs',
        '@sgratzl/chartjs-esm-facade': 'ChartESMFacade',
      },
    },
    external: Object.keys(pkg.peerDependencies || {}),
    plugins: [commonjs(), pnp(), resolve(), babel({ babelHelpers: 'runtime' })],
  },
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'esm',
    },
    external: Object.keys(pkg.peerDependencies || {}).concat(Object.keys(pkg.dependencies || {}), [
      'graphlib/lib/graph',
      'dagre/lib/layout',
    ]),
    plugins: [commonjs(), pnp(), resolve()],
  },
];
