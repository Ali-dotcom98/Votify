const fs = require('fs');
const { execSync } = require('child_process');

const testDir = './tests';
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.js'));

let passed = 0;
let failed = 0;
let details = '';

for (const file of files) {
    const filePath = `${testDir}/${file}`;
    details += `\n🧪 Running: ${file}\n`;

    try {
        execSync(`node ${filePath}`, { stdio: 'inherit' });
        details += `✅ Passed: ${file}\n`;
        passed++;
    } catch (err) {
        details += `❌ Failed: ${file}\n`;
        failed++;
    }
}

const summary = `📋 Test Report Summary
==========================
✅ Total Passed: ${passed}
❌ Total Failed: ${failed}
==========================\n`;

const finalReport = summary + details;

fs.writeFileSync('test-report.txt', finalReport);
console.log(finalReport);
