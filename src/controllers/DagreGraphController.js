import { Chart, merge, patchControllerConfig, registerController } from '../chart';
import { GraphController } from 'chartjs-chart-graph';

export class DagreGraphController extends GraphController {
  resyncLayout() {
    const meta = this._cachedMeta;

    // meta.root = hierarchy(this.getTreeRoot(), (d) => this.getDagreGraphChildren(d))
    //   .count()
    //   .sort((a, b) => b.height - a.height || b.data.index - a.data.index);

    // this.doLayout(meta.root);

    super.resyncLayout();
  }

  reLayout() {
    this.doLayout(this._cachedMeta.root);
  }

  doLayout(root) {
    const options = this._config.dagre;

    // const layout = options.mode === 'tree' ? tree() : cluster();

    // if (options.orientation === 'radial') {
    //   layout.size([Math.PI * 2, 1]);
    // } else {
    //   layout.size([2, 2]);
    // }

    // const orientation = {
    //   horizontal: (d) => {
    //     d.data.x = d.y - 1;
    //     d.data.y = -d.x + 1;
    //   },
    //   vertical: (d) => {
    //     d.data.x = d.x - 1;
    //     d.data.y = -d.y + 1;
    //   },
    //   radial: (d) => {
    //     d.data.x = Math.cos(d.x) * d.y;
    //     d.data.y = Math.sin(d.x) * d.y;
    //     d.data.angle = d.y === 0 ? Number.NaN : d.x;
    //   },
    // };

    // layout(root).each(orientation[options.orientation] || orientation.horizontal);

    // requestAnimationFrame(() => this.chart.update());
  }
}

DagreGraphController.id = 'dendogram';
DagreGraphController.register = () => {
  GraphController.register();
  DagreGraphController.defaults = merge({}, [
    GraphController.defaults,
    {
      datasets: {
        dagre: {
          // TODO
        },
        animations: {
          numbers: {
            type: 'number',
            properties: ['x', 'y', 'angle', 'radius', 'borderWidth'],
          },
        },
        tension: 0.4,
      },
      scales: {
        x: {
          min: -1,
          max: 1,
        },
        y: {
          min: -1,
          max: 1,
        },
      },
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
