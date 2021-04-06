import { registry } from 'chart.js';
import { DagreGraphController } from './controllers';

export * from '.';

registry.addControllers(DagreGraphController);
