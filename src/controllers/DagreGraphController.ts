import { Chart, ChartItem, IChartConfiguration, IChartDataset, LinearScale, Point } from 'chart.js';
import { merge } from '../../chartjs-helpers/core';
import {
  GraphController,
  EdgeLine,
  IGraphChartControllerDatasetOptions,
  IGraphDataPoint,
  IGraphEdgeDataPoint,
} from 'chartjs-chart-graph';
import Graph from 'graphlib/lib/graph';
import layout from 'dagre/lib/layout';
import patchController from './patchController';

export class DagreGraphController extends GraphController {
  declare _config: IDagreOptions;

  resyncLayout() {
    this.doLayout();

    super.resyncLayout();
  }

  reLayout() {
    this.doLayout();
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

    layout(g as any, options);

    g.nodes().forEach((n, i) => {
      const attrs = g.node(n);
      nodes[i].x = attrs.x;
      nodes[i].y = attrs.y;
    });
    g.edges().forEach((e, i) => {
      const attrs = g.edge(e);
      edges[i].points = attrs.points.slice(1, -1);
    });

    requestAnimationFrame(() => this.chart.update());
  }

  static readonly id = 'dagre';
  static readonly defaults: any = /*#__PURE__*/ merge({}, [
    GraphController.defaults,
    {
      datasets: {
        dagre: {
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
}

export interface IDagreOptions {
  dagre:
    | {
        graph: any;
        node: any;
        edge: any;
      }
    | any;
}

export interface IDagreGraphChartControllerDatasetOptions extends IGraphChartControllerDatasetOptions, IDagreOptions {}

export type IDagreGraphChartControllerDataset<T = IGraphDataPoint, E = IGraphEdgeDataPoint> = IChartDataset<
  T,
  IDagreGraphChartControllerDatasetOptions
> & {
  edges?: E[];
};

export type IDagreGraphChartControllerConfiguration<
  T = IGraphDataPoint,
  E = IGraphEdgeDataPoint,
  L = string
> = IChartConfiguration<'dagre', T, L, IDagreGraphChartControllerDataset<T, E>>;

export class DagreGraphChart<T = IGraphDataPoint, E = IGraphEdgeDataPoint, L = string> extends Chart<
  T,
  L,
  IDagreGraphChartControllerConfiguration<T, E, L>
> {
  static readonly id = DagreGraphController.id;

  constructor(item: ChartItem, config: Omit<IDagreGraphChartControllerConfiguration<T, E, L>, 'type'>) {
    super(item, patchController('dagre', config, DagreGraphController, [EdgeLine, Point], LinearScale));
  }
}
