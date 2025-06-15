const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configuration
const config = {
    baseUrl: 'http://localhost:3000',
    loginPath: '/Site/Login',
    validCredentials: {
        email: 'Alishah1234584.as@gmail.com',
        password: '12345'
    }
};

async function testDashboard() {
    let driver;
    try {
        console.log('1. Setting up browser...');
        const options = new chrome.Options();
        options.addArguments('--headless=new');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        console.log('2. Logging in...');
        await driver.get(`${config.baseUrl}${config.loginPath}`);
        await driver.findElement(By.id('Email')).sendKeys(config.validCredentials.email);
        await driver.findElement(By.id('Password')).sendKeys(config.validCredentials.password);
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('3. Verifying dashboard...');
        await driver.wait(until.urlContains('home'), 10000);

        // Test 1: Check dashboard header
        const header = await driver.findElement(By.css('h1.text-2xl.font-bold.text-gray-900'));
        console.log(`✔ Dashboard header: "${await header.getText()}"`);

        // Test 2: Verify navigation links
        const navLinks = await driver.findElements(By.css('.grid.grid-cols-2 a'));
        console.log(`✔ Found ${navLinks.length} navigation links`);

        // Test 3: Check candidate cards
        const parties = ['PTI', 'PMLN', 'MQM', 'PPP', 'JI'];
        for (const party of parties) {
            const card = await driver.findElement(By.id(party));
            console.log(`✔ ${party} card is displayed`);
        }

        // Test 4: Verify PTI card interaction
        console.log('4. Testing PTI card interaction...');
        const ptiCard = await driver.findElement(By.id('PTI'));
        await ptiCard.click();
        const modal = await driver.wait(until.elementLocated(By.id('Content1')), 5000);
        console.log('✔ PTI modal appeared');
        await driver.findElement(By.id('close1')).click();
        await driver.wait(until.elementIsNotVisible(modal), 3000);
        console.log('✔ PTI modal closed');

        console.log('✅ All dashboard tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        if (driver) {
            console.log('5. Closing browser...');
            await driver.quit();
        }
    }
}

// Run the test
testDashboard();