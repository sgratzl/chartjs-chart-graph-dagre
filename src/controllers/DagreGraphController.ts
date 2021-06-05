import { Chart, ChartItem, ChartConfiguration, LinearScale, PointElement } from 'chart.js';
import { merge } from 'chart.js/helpers';
import {
  GraphController,
  EdgeLine,
  IGraphChartControllerDatasetOptions,
  IGraphDataPoint,
  ITreeNode,
} from 'chartjs-chart-graph';
import Graph from 'graphlib/lib/graph';
import layout from 'dagre/lib/layout';
import patchController from './patchController';

export class DagreGraphController extends GraphController {
  declare _config: IDagreOptions;

  resyncLayout(): void {
    this.doLayout();

    super.resyncLayout();
  }

  reLayout(): void {
    this.doLayout();
  }

  doLayout(): void {
    const options = ((this as any).options as IDagreOptions).dagre;

    const g = new Graph();
    g.setGraph(options.graph);

    const meta = this._cachedMeta;
    const nodes = meta._parsed as ITreeNode[];
    const edges = meta._parsedEdges;
    nodes.forEach((_, i) => {
      g.setNode(i.toString(), typeof options.node === 'function' ? options.node(i) : { ...options.node });
    });
    edges.forEach((edge) => {
      g.setEdge(
        edge.source.toString(),
        edge.target.toString(),
        typeof options.edge === 'function' ? options.edge(edge.source, edge.target) : { ...options.edge }
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

  static readonly defaults: any = /* #__PURE__ */ merge({}, [
    GraphController.defaults,
    {
      animations: {
        numbers: {
          type: 'number',
          properties: ['x', 'y', 'angle', 'radius', 'borderWidth'],
        },
      },
      dagre: {
        graph: {},
        node: {},
        edge: {},
      },
    },
  ]);

  static readonly overrides: any = /* #__PURE__ */ GraphController.overrides;
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

export interface IDagreGraphChartControllerDatasetOptions
  extends Omit<IGraphChartControllerDatasetOptions, 'edges'>,
    IDagreOptions {
  edges: { source: string | number; target: string | number }[];
}

declare module 'chart.js' {
  export interface ChartTypeRegistry {
    dagre: {
      chartOptions: CoreChartOptions<'dagre'>;
      datasetOptions: IDagreGraphChartControllerDatasetOptions;
      defaultDataPoint: IGraphDataPoint;
      parsedDataType: ITreeNode;
      scales: keyof CartesianScaleTypeRegistry;
    };
  }
}

export class DagreGraphChart<DATA extends unknown[] = IGraphDataPoint[], LABEL = string> extends Chart<
  'dagre',
  DATA,
  LABEL
> {
  static readonly id = DagreGraphController.id;

  constructor(item: ChartItem, config: Omit<ChartConfiguration<'dagre', DATA, LABEL>, 'type'>) {
    super(item, patchController('dagre', config, GraphController, [EdgeLine, PointElement], LinearScale));
  }
}
