const fs = require('fs');
const content = fs.readFileSync('e:/creators-platform/client/debug_output.txt', 'utf8');

const idx1 = content.indexOf('Login Component');
const idx2 = content.indexOf('Test Suites:', idx1);
const section = content.substring(idx1, idx2 > 0 ? idx2 + 200 : idx1 + 5000);
const clean = section.replace(/\x1B\[[0-9;]*m/g, '');

fs.writeFileSync('e:/creators-platform/client/clean_output.txt', clean, 'utf8');
console.log('Written clean_output.txt, length:', clean.length);
