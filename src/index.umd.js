export * from '.';

import { registry } from '@sgratzl/chartjs-esm-facade';
import { DagreGraphController } from './controllers';

registry.addControllers(DagreGraphController);
