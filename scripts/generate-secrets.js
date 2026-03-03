const fs = require('fs');
const path = require('path');

const secretsPath = path.join(__dirname, '../src/environments/secrets.ts');

// Valores por defecto si no existen las variables de entorno
const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:1998';
const apiBaseUrlProd = process.env.API_BASE_URL_PROD || 'https://zaidin.onrender.com';

const secretsContent = `export const secrets = {
  apiBaseUrl: '${apiBaseUrl}',
  apiBaseUrlProd: '${apiBaseUrlProd}'
};
`;

// Asegurar que el directorio existe
const dir = path.dirname(secretsPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(secretsPath, secretsContent);
console.log('✅ El archivo src/environments/secrets.ts ha sido generado desde variables de entorno.');
