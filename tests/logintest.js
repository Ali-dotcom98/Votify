const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

async function testLogin() {

    let options = new chrome.Options();
    // options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');


    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log("1. Navigating to login page...");
        await driver.get('http://localhost:3000/Site/Login');


        await driver.wait(until.elementLocated(By.id('Email')), 5000);

        console.log("2. Filling email field...");
        const emailField = await driver.findElement(By.id('Email'));
        await emailField.clear();
        await emailField.sendKeys('test@example.com');

        console.log("3. Filling password field...");
        const passwordField = await driver.findElement(By.id('Password'));
        await passwordField.clear();
        await passwordField.sendKeys('wrongpassword');

        console.log("4. Clicking login button...");
        const loginButton = await driver.findElement(By.css('button[type="submit"]'));
        await loginButton.click();

        console.log("5. Waiting for response...");

        await driver.wait(async () => {
            const currentUrl = await driver.getCurrentUrl();
            const errorElements = await driver.findElements(By.id('error'));
            return currentUrl !== 'http://localhost:3000/Site/Login' || errorElements.length > 0;
        }, 5000);


        const errorElements = await driver.findElements(By.id('error'));
        if (errorElements.length > 0) {
            const errorText = await errorElements[0].getText();
            console.log(`✔ Test passed - Error message displayed: "${errorText}"`);
            assert.ok(errorText.length > 0, 'Error message should not be empty');
        } else {
            const currentUrl = await driver.getCurrentUrl();
            console.log(`✖ Test failed - Unexpected redirect to: ${currentUrl}`);
            assert.fail('Login should have failed with error message');
        }
    } catch (error) {
        console.error('Test failed:', error);
        throw error;
    } finally {
        console.log("6. Closing browser...");
        await driver.quit();
    }
}

testLogin().catch(console.error);