import matchChart from '../__tests__/matchChart';
import { DagreGraphController } from './DagreGraphController';
import data from './__tests__/data';

describe('dagre', () => {
  beforeAll(() => {
    DagreGraphController.register();
  });
  test('default', () => {
    return matchChart({
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
          display: true,
        },
      },
    });
  });
});
