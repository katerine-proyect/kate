import { secrets } from './secrets';

export const environment = {
  production: true,
  apiBaseUrl: secrets.apiBaseUrlProd || 'https://zaidin.onrender.com'
};
