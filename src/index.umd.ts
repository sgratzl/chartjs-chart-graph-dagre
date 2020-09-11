export * from '.';

import { registry } from 'chart.js';
import { DagreGraphController } from './controllers';

registry.addControllers(DagreGraphController);
