import { Chart, merge, patchControllerConfig, registerController } from '../chart';
import { GraphController } from 'chartjs-chart-graph';
import Graph from 'graphlib/lib/graph';
import layout from 'dagre/lib/layout';

export class DagreGraphController extends GraphController {
  resyncLayout() {
    this.doLayout();

    super.resyncLayout();
  }

  reLayout() {
    this.doLayout(this._cachedMeta._graph);
  }

  doLayout() {
    const options = this._config.dagre;

    const g = new Graph();
    g.setGraph(options.graph);

    const meta = this._cachedMeta;
    const nodes = meta._parsed;
    const edges = meta._parsedEdges;
    nodes.forEach((_, i) => {
      g.setNode(i.toString(), typeof options.node === 'function' ? options.node(i) : Object.assign({}, options.node));
    });
    edges.forEach((edge) => {
      g.setEdge(
        edge.source.toString(),
        edge.target.toString(),
        typeof options.edge === 'function' ? options.edge(edge.source, edge.target) : Object.assign({}, options.edge)
      );
    });

    layout(g, options);

    g.nodes().forEach((n, i) => {
      const attrs = g.node(n);
      nodes[i].x = attrs.x;
      nodes[i].y = attrs.y;
    });
    // g.edges().forEach((e, i) => {
    //   const attrs = g.edge(e);
    //   edges[i].x = attrs.x;
    //   edges[i].y = attrs.y;
    // });

    requestAnimationFrame(() => this.chart.update());
  }
}

DagreGraphController.id = 'dagre';
DagreGraphController.register = () => {
  GraphController.register();
  DagreGraphController.defaults = merge({}, [
    GraphController.defaults,
    {
      datasets: {
        dagre: {
          // TODO
          graph: {},
          node: {},
          edge: {},
        },
        animations: {
          numbers: {
            type: 'number',
            properties: ['x', 'y', 'angle', 'radius', 'borderWidth'],
          },
        },
      },
      // scales: {
      //   x: {
      //     min: -1,
      //     max: 1,
      //   },
      //   y: {
      //     min: -1,
      //     max: 1,
      //   },
      // },
    },
  ]);
  return registerController(DagreGraphController);
};

export class DagreGraphChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, DagreGraphController));
  }
}
DagreGraphChart.id = DagreGraphController.id;
