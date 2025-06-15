const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testLeaderboardNavigation() {
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
        console.log('1. Launching browser...');
        const options = new chrome.Options();
        options.addArguments('--headless=new'); // Disable headless to see the test
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        // Login first
        console.log('2. Logging in...');
        await driver.get(`${config.baseUrl}${config.loginPath}`);
        await driver.findElement(By.id('Email')).sendKeys(config.validCredentials.email);
        await driver.findElement(By.id('Password')).sendKeys(config.validCredentials.password);
        await driver.findElement(By.css('button[type="submit"]')).click();

        // Wait for dashboard
        console.log('3. Waiting for dashboard to load...');
        await driver.wait(until.urlContains('home'), 10000);

        // Find and click Leaderboard link using the exact structure from your HTML
        console.log('4. Locating Leaderboard link...');
        const leaderboardLink = await driver.wait(
            until.elementLocated(By.xpath(`
                //a[contains(@href, '/Leaderboard')]
                //div[contains(@class, 'flex flex-row')]
                //p[contains(@class, 'capitalize') and text()='Leaderboard']
            `)),
            5000
        );

        console.log('5. Clicking Leaderboard link...');
        await leaderboardLink.click();

        // Verify navigation to leaderboard page
        console.log('6. Verifying leaderboard page...');
        await driver.wait(until.urlContains('Leaderboard'), 5000);
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('Leaderboard')) {
            console.log('✔ Successfully navigated to leaderboard page');

            // Additional verification - check for leaderboard elements
            try {
                const leaderboardHeader = await driver.wait(
                    until.elementLocated(By.css('h1.leaderboard-header, h1:textContains("Leaderboard")')),
                    3000
                );
                console.log(`Leaderboard header: ${await leaderboardHeader.getText()}`);
            } catch {
                console.log('ℹ No specific leaderboard header found, but URL is correct');
            }
        } else {
            console.log('✖ Failed to navigate to leaderboard page');
            console.log(`Current URL: ${currentUrl}`);
        }

    } catch (error) {
        console.error('❌ Test failed:', error);

        // Take screenshot on failure
        if (driver) {
            const screenshot = await driver.takeScreenshot();
            require('fs').writeFileSync('leaderboard-test-failure.png', screenshot, 'base64');
            console.log('Screenshot saved as leaderboard-test-failure.png');
        }
    } finally {
        if (driver) {
            console.log('7. Closing browser...');
            await driver.quit();
        }
    }
}

// Run the test
testLeaderboardNavigation();