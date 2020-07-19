# Chart.js Graphs Dagre Layout

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

Adds another graph controller `dagre` to chart.js based on [chartjs-chart-graph](https://github.com/sgratzl/chartjs-chart-graph) which uses the [Dagre](https://github.com/dagrejs/dagre) library for performing the graph layout.

**Works only with Chart.js >= 3.0.0**

## Install

```bash
npm install --save chart.js@next @sgratzl/chartjs-esm-facade@next chartjs-chart-graph@next chartjs-chart-graph-dagre
```

## Usage

see [Samples](https://github.com/sgratzl/chartjs-chart-graph-dagre/tree/master/samples) on Github

## Options

The options are wrapper for specifying dagre graph, node, and edge options. see https://github.com/dagrejs/dagre/wiki#configuring-the-layout.

```ts
interface IDagreOptions {
  dagre: {
    /**
     * dagre graph options
     */
    graph: {};
    /**
     * dagre node options or a function generating the option per node
     */
    node: ((i: number) => {}) | {};
    /**
     * dagre edge options or a function generating the option per edge
     */
    edge: ((source: number, target: number) => {}) | {};
  };
}
```

### ESM and Tree Shaking

The ESM build of the library supports tree shaking thus having no side effects. As a consequence the chart.js library won't be automatically manipulated nor new controllers automatically registered. One has to manually import and register them.

Variant A:

```js
import Chart from 'chart.js';
import { EdgeLine } from 'chartjs-chart-graph';
import { DagreGraphController } from 'chartjs-chart-graph-dagre';

// register controller in chart.js and ensure the defaults are set
Chart.register(DagreGraphController, EdgeLine);
...

new Chart(ctx, {
  type: DagreGraphController.id,
  data: [...],
});
```

Variant B:

```js
import { DagreGraphChart } from 'chartjs-chart-graph-dagre';

new DagreGraphChart(ctx, {
  data: [...],
});
```

## Development Environment

```sh
npm i -g yarn
yarn set version 2
yarn
yarn pnpify --sdk
```

### Building

```sh
yarn install
yarn build
```

[npm-image]: https://badge.fury.io/js/chartjs-chart-graph-dagre.svg
[npm-url]: https://npmjs.org/package/chartjs-chart-graph-dagre
[github-actions-image]: https://github.com/sgratzl/chartjs-chart-graph-dagre/workflows/ci/badge.svg
[github-actions-url]: https://github.com/sgratzl/chartjs-chart-graph-dagre/actions
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
