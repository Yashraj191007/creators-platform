const { execSync } = require('child_process');
const fs = require('fs');

// Run jest with a specific pattern and capture output
const cmd = `npx jest --no-color --forceExit --testNamePattern "displays the page" 2>&1`;

let result = '';
try {
  result = execSync(cmd, {
    cwd: 'e:/creators-platform/client',
    encoding: 'utf8',
    timeout: 20000,
    env: { ...process.env, FORCE_COLOR: '0', CI: 'true' }
  });
} catch (e) {
  result = (e.stdout || '') + '\n' + (e.stderr || '');
}

// Write clean output
fs.writeFileSync('e:/creators-platform/client/debug_output.txt', result, 'utf8');
console.log('Done. Length:', result.length);
console.log(result.substring(0, 3000));
