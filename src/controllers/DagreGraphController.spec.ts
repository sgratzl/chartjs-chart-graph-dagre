import createChart from '../__tests__/createChart';
import { DagreGraphController } from './DagreGraphController';
import data from './__tests__/data';

describe('dagre', () => {
  beforeAll(() => {
    DagreGraphController.register();
  });
  test('default', () => {
    return createChart({
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
