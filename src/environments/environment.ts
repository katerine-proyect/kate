import { secrets } from './secrets';

export const environment = {
  production: false,
  apiBaseUrl: secrets.apiBaseUrl || 'http://localhost:1998'
};
