const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

async function testSignup() {
    // Configure Chrome options to suppress GPU warnings
    let options = new chrome.Options()
        // .addArguments('--headless=new')
        .addArguments('--no-sandbox')
        .addArguments('--disable-dev-shm-usage')
        .addArguments('--disable-gpu')
        .addArguments('--log-level=3');  // Suppress console logs

    // Build driver instance
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log("1. Navigating to signup page...");
        await driver.get('http://localhost:3000/Site/Signup');
        await driver.wait(until.elementLocated(By.id('Username')), 5000);

        // Generate random test data

        const testUsername = "Test311@gmail.com";
        const testPassword = "123456";

        console.log("2. Filling name field with:", testUsername);
        const nameField = await driver.findElement(By.id('Username'));
        await nameField.clear();
        await nameField.sendKeys(testUsername);

        console.log("3. Filling password field...");
        const passwordField = await driver.findElement(By.id('Password'));
        await passwordField.clear();
        await passwordField.sendKeys(testPassword);

        console.log("4. Clicking signup button...");
        const signupButton = await driver.findElement(By.css('button[type="submit"]'));
        await signupButton.click();

        console.log("5. Waiting for response (max 10 seconds)...");
        // Wait for either:
        // - Redirect to home page (success)
        // - Error message display
        // - Form remains with validation errors
        await driver.wait(async () => {
            const currentUrl = await driver.getCurrentUrl();

            // Case 1: Successfully redirected to home
            if (currentUrl.includes('home')) return true;

            // Case 2: Check for error message
            try {
                const message = await driver.findElement(By.id('message'));
                if (await message.isDisplayed()) return true;
            } catch { }

            // Case 3: Check for validation errors
            try {
                const invalidFields = await driver.findElements(By.css('.Invalid'));
                if (invalidFields.length > 0) return true;
            } catch { }

            return false;
        }, 10000);

        // Determine result
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('home')) {
            console.log(`✔ Signup successful - Redirected to: ${currentUrl}`);
            assert.ok(true, 'Successful signup should redirect to home');
        }
        else {
            // Check for error message
            try {
                const messageElement = await driver.findElement(By.id('message'));
                const messageText = await messageElement.getText();

                if (messageText.trim()) {
                    console.log(`✔ Message displayed: "${messageText}"`);
                    assert.ok(true, 'Received expected message');
                } else {
                    console.log('⚠ Empty message element found');
                    assert.fail('Message element exists but is empty');
                }
            } catch {
                // Check for validation errors
                try {
                    const invalidFields = await driver.findElements(By.css('.Invalid'));
                    if (invalidFields.length > 0) {
                        console.log('✔ Form validation errors present');
                        assert.ok(true, 'Form validation working as expected');
                    } else {
                        // Take screenshot for debugging
                        await driver.takeScreenshot().then(image => {
                            require('fs').writeFileSync('signup-test-failure.png', image, 'base64');
                            console.log('Screenshot saved as signup-test-failure.png');
                        });
                        assert.fail('Unexpected state - no redirect, no message, no validation errors');
                    }
                } catch {
                    assert.fail('Could not determine signup result');
                }
            }
        }
    } catch (error) {
        console.error('Test failed:', error.message);
        // Take screenshot on failure
        await driver.takeScreenshot().then(image => {
            require('fs').writeFileSync('signup-test-error.png', image, 'base64');
            console.log('Screenshot saved as signup-test-error.png');
        });
        throw error;
    } finally {
        console.log("6. Closing browser...");
        await driver.quit();
    }
}

testSignup()
    .then(() => console.log('✅ Signup test completed successfully'))
    .catch(() => console.log('❌ Signup test failed'));