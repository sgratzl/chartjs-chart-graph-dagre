import { registry, LinearScale, PointElement } from 'chart.js';
import { EdgeLine } from 'chartjs-chart-graph';
import createChart from '../__tests__/createChart';
import { DagreGraphController } from './DagreGraphController';
import data from './__tests__/data';

describe('dagre', () => {
  beforeAll(() => {
    registry.addControllers(DagreGraphController);
    registry.addElements(EdgeLine, PointElement);
    registry.addScales(LinearScale);
  });
  test('default', async () => {
    const chart = createChart(
      {
        type: DagreGraphController.id as 'dagre',
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
        },
      },
      300,
      300
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    return chart.toMatchImageSnapshot();
  });
});
