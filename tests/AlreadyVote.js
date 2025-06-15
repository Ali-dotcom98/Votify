const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testVoteErrorMessage() {
    // Suppress unnecessary Chrome logs
    const options = new chrome.Options()
        // .addArguments('--headless=new')
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage')
        .addArguments('--log-level=3')  // Suppresses most Chrome logs
        .addArguments('--disable-logging');  // Disables Chrome driver logs

    const config = {
        baseUrl: 'http://localhost:3000',
        loginPath: '/Site/Login',
        validCredentials: {
            email: 'Alishah1234584.as@gmail.com',
            password: '12345'
        }
    };

    let driver;
    try {
        console.log('1. 🚀 Launching Chrome browser...');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        console.log('   ✔ Browser launched');

        console.log('2. 🔑 Logging in...');
        await driver.get(`${config.baseUrl}${config.loginPath}`);
        await driver.findElement(By.id('Email')).sendKeys(config.validCredentials.email);
        await driver.findElement(By.id('Password')).sendKeys(config.validCredentials.password);
        await driver.findElement(By.css('button[type="submit"]')).click();
        console.log('   ✔ Login successful');

        console.log('3. 🗳️ Navigating to Vote page...');
        const voteLink = await driver.wait(
            until.elementLocated(By.xpath("//p[text()='Vote']/ancestor::a")),
            5000
        );
        await voteLink.click();
        console.log('   ✔ Reached Vote page');

        console.log('4. 🔍 Checking for voting error...');
        const errorDiv = await driver.wait(
            until.elementLocated(By.css('div.text-red-700#message')),
            3000
        );
        const errorText = await errorDiv.getText();
        console.log(`   ✖ Voting error: "${errorText}"`);

        if (/already (voted|have voted)/i.test(errorText)) {
            console.log('5. ⚠️  Valid voting error detected');
            console.log('\n🏁 TEST SUCCESS: Correctly identified voting restriction');
            return;
        }

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
    } finally {
        if (driver) {
            console.log('   ✔ Closing browser...');
            await driver.quit().catch(() => { }); // Silent quit
        }
    }
}

// Run with clean output
console.log('Starting voting test...\n');
testVoteErrorMessage()
    .then(() => process.exit(0))  // Clean exit
    .catch(() => process.exit(1));