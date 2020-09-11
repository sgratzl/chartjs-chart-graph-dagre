import createChart from '../__tests__/createChart';
import { DagreGraphController, IDagreGraphChartControllerConfiguration } from './DagreGraphController';
import { registry, Point, LinearScale } from 'chart.js';
import data from './__tests__/data';
import { EdgeLine } from 'chartjs-chart-graph';

describe('dagre', () => {
  beforeAll(() => {
    registry.addControllers(DagreGraphController);
    registry.addElements(EdgeLine, Point);
    registry.addScales(LinearScale);
  });
  test('default', () => {
    return createChart<
      { id: string },
      string,
      IDagreGraphChartControllerConfiguration<{ id: string }, { source: string; target: string }, string>
    >({
      type: DagreGraphController.id,
      data: {
        labels: data.nodes.map((d) => d.id),
        datasets: [
          {
            dagre: {
              graph: {
                rankdir: 'BT',
              },
            },
            pointBackgroundColor: 'steelblue',
            pointRadius: 5,
            data: data.nodes,
            edges: data.links,
          },
        ],
      },
      options: {
        elements: {
          point: {
            radius: 10,
            hoverRadius: 12,
          },
          line: {
            borderColor: 'black',
          },
        },
        legend: {
          display: false,
        },
      },
    }).toMatchImageSnapshot();
  });
});
