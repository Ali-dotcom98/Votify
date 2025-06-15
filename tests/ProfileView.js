const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

async function testProfileViewNavigation() {
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
        console.log('1. 🚀 Launching browser...');
        const options = new chrome.Options()
            // .addArguments('--headless=new')
            .addArguments('--disable-dev-shm-usage');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        console.log('2. 🔑 Logging in...');
        await driver.get(`${config.baseUrl}${config.loginPath}`);
        await driver.findElement(By.id('Email')).sendKeys(config.validCredentials.email);
        await driver.findElement(By.id('Password')).sendKeys(config.validCredentials.password);
        await driver.findElement(By.css('button[type="submit"]')).click();

        console.log('3. 🏠 Navigating to dashboard...');
        await driver.wait(until.urlContains('home'), 5000);

        console.log('4. 👤 Clicking Profile link...');
        const profileLink = await driver.wait(
            until.elementLocated(By.xpath("//p[text()='Profile']/ancestor::a")),
            5000
        );
        await profileLink.click();

        console.log('5. 🔍 Verifying profile page loaded...');
        await driver.wait(until.urlContains('UserProfile'), 5000);

        console.log('6. 👁️ Clicking view (eye) icon...');
        const viewButton = await driver.wait(
            until.elementLocated(By.id('View')),
            3000
        );
        await viewButton.click();

        console.log('7. 🔎 Verifying User Profile page...');
        // Wait for User Profile heading
        const profileHeader = await driver.wait(
            until.elementLocated(By.xpath("//div[contains(@class, 'text-2xl') and contains(text(), 'User Profile')]")),
            5000
        );

        assert.ok(await profileHeader.isDisplayed(), 'User Profile header should be visible');
        console.log(`✔ Verified header: "${await profileHeader.getText()}"`);

        // Verify back button exists
        const backButton = await driver.findElement(By.xpath("//a[contains(@href, '/home/UserProfile')]"));
        assert.ok(await backButton.isDisplayed(), 'Back button should exist');

        // Verify user data is displayed
        const userName = await driver.findElement(By.css('h1.text-2xl.font-semibold'));
        console.log(`✔ User name displayed: "${await userName.getText()}"`);

        // Verify form fields contain data
        const nameField = await driver.findElement(By.id('Name'));
        assert.notEqual(await nameField.getAttribute('placeholder'), '', 'Name field should have data');

        const cnicField = await driver.findElement(By.id('Email'));
        assert.notEqual(await cnicField.getAttribute('placeholder'), '', 'CNIC field should have data');

        console.log('\n🏁 TEST COMPLETE: Successfully navigated to User Profile view');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        if (driver) {
            await driver.takeScreenshot().then(image => {
                require('fs').writeFileSync('profile-view-failure.png', image, 'base64');
                console.log('Screenshot saved as profile-view-failure.png');
            });
        }
        throw error;
    } finally {
        if (driver) {
            console.log('🧹 Closing browser...');
            await driver.quit();
        }
    }
}

console.log('\nStarting profile view navigation test...');
testProfileViewNavigation()
    .then(() => console.log('\n✅ Profile view navigation test passed'))
    .catch(() => console.log('\n❌ Profile view navigation test failed'));