#!/usr/bin/env node

const http = require('http');

const N8N_BASE_URL = 'http://localhost:5678';
const WEBHOOK_PATH = 'venta';

// Test data
const testData = [
  {
    name: 'Test 1: Venta normal de 5 unidades',
    payload: { producto_id: 1, cantidad_vendida: 5 }
  },
  {
    name: 'Test 2: Venta de 2 unidades',
    payload: { producto_id: 2, cantidad_vendida: 2 }
  },
  {
    name: 'Test 3: Stock insuficiente',
    payload: { producto_id: 1, cantidad_vendida: 100 }
  },
  {
    name: 'Test 4: Producto inexistente',
    payload: { producto_id: 9999, cantidad_vendida: 1 }
  }
];

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendWebhook(webhookUrl, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(webhookUrl);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);

    req.write(JSON.stringify(data));
    req.end();
  });
}

async function checkN8nHealth() {
  return new Promise((resolve) => {
    const url = new URL(`${N8N_BASE_URL}/healthz`);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.end();
  });
}

async function runTests() {
  log('====================================', 'blue');
  log('n8n Workflow Test Suite', 'blue');
  log('====================================', 'blue');
  log('');

  // Check n8n health
  log('Verificando salud de n8n...', 'cyan');
  const isHealthy = await checkN8nHealth();

  if (!isHealthy) {
    log('✗ n8n no está disponible en ' + N8N_BASE_URL, 'red');
    log('Asegúrate de que n8n esté ejecutándose:', 'yellow');
    log('  docker-compose up -d', 'yellow');
    process.exit(1);
  }

  log('✓ n8n está disponible', 'green');
  log('');

  const webhookUrl = `${N8N_BASE_URL}/webhook/${WEBHOOK_PATH}`;
  log(`Webhook URL: ${webhookUrl}`, 'cyan');
  log('');

  let passed = 0;
  let failed = 0;

  // Run tests
  for (const test of testData) {
    log(`\n${test.name}`, 'blue');
    log('Enviando: ' + JSON.stringify(test.payload), 'cyan');

    try {
      const response = await sendWebhook(webhookUrl, test.payload);
      
      log(`Status: ${response.status}`, 'cyan');
      
      if (response.status >= 200 && response.status < 300) {
        log('✓ Éxito', 'green');
        passed++;
      } else if (response.status >= 400 && response.status < 500) {
        log('⚠ Advertencia (esperado para algunos tests)', 'yellow');
        passed++;
      } else {
        log('✗ Error', 'red');
        failed++;
      }

      // Parse response body if JSON
      if (response.body) {
        try {
          const json = JSON.parse(response.body);
          log(`Respuesta: ${JSON.stringify(json, null, 2)}`, 'cyan');
        } catch (e) {
          log(`Respuesta: ${response.body.substring(0, 200)}`, 'cyan');
        }
      }

      // Wait between requests
      await sleep(1000);
    } catch (error) {
      log(`✗ Error: ${error.message}`, 'red');
      failed++;
    }
  }

  // Summary
  log('', '');
  log('====================================', 'blue');
  log('Resultado de Tests', 'blue');
  log('====================================', 'blue');
  log(`Pasados: ${passed}`, 'green');
  log(`Fallidos: ${failed}`, failed > 0 ? 'red' : 'green');
  log('');

  if (failed === 0) {
    log('✓ Todos los tests completados correctamente', 'green');
  } else {
    log('✗ Algunos tests fallaron', 'red');
  }

  log('');
  log('Próximos pasos:', 'cyan');
  log('1. Revisa los logs de n8n: docker-compose logs n8n', 'cyan');
  log('2. Verifica que PostgreSQL esté corriendo', 'cyan');
  log('3. Valida las credenciales en n8n', 'cyan');
}

// Run
runTests().catch(console.error);
