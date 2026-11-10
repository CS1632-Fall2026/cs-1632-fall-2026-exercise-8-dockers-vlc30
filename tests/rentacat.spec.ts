import { test, expect } from '@playwright/test';
// import { execSync } from 'child_process';

const appUrl = 'http://localhost:8080/';
//const appUrl = 'https://cs1632.appspot.com/';
//const appUrl = 'https://cs1632-buggier.appspot.com/';

async function openApp(page) {
  await page.goto(appUrl);
    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    });
    await page.reload();
}

test.beforeEach(async ({ page }) => {
  await openApp(page);
});

// TODO: Fill in with test cases.
// test('TEST-0-wait-for-webserver', async ({  }) => {
//     try {
//     // Executes the script. Adjust the path to where your script is located.
//       execSync('sh wait-for-webserver.sh', { stdio: 'inherit', timeout: 300000  });
//       console.log('Webserver is ready!');
      
//     } catch (error) {
//     console.error('Failed to verify webserver status:', error);
//     throw error; // Fails the test suite if the script fails
//   }
// });

test('TEST-1-RESET', async ({ page }) => { 
    await page.evaluate(() => {
    document.cookie = "1=true";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });
    await page.reload();

    await page.getByRole('link', { name: 'Reset' }).click();
  
    //const colleges = page.getByRole('dialog').getByRole('navigation', { name: 'COLLEGES & SCHOOLS' });
    const firstCat = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem').nth(0);
    await expect(firstCat).toHaveText('ID 1. Jennyanydots');
    const secondCat = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem').nth(1);
    await expect(secondCat).toHaveText('ID 2. Old Deuteronomy');
    const thirdCat = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem').nth(2);
    await expect(thirdCat).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => { 
    await page.getByRole('link', { name: 'Catalog' }).click();
    //const secondCat = page.getByRole('list', { name: 'Cat photos' }).getByRole('listitem').nth(1);
    //await expect(secondCat).toHaveText('ID 2. Old Deuteronomy');
    await expect(page.getByRole('list', { name: 'Cat photos' }).getByRole('listitem').nth(1).getByRole('img')).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => { 
    await page.getByRole('link', { name: 'Catalog' }).click();
    const catListing = page.getByRole('list', { name: 'Cat names' });
    await expect(catListing.getByRole('listitem')).toHaveCount(3);
    const thirdCat = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem').nth(2);
    await expect(thirdCat).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => { 
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => { 
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).fill('1');
    await page.getByRole('button', { name: 'Rent' }).click();

    const firstCat = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem').nth(0);
    await expect(firstCat).toHaveText('Rented out');
    const secondCat = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem').nth(1);
    await expect(secondCat).toHaveText('ID 2. Old Deuteronomy');
    const thirdCat = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem').nth(2);
    await expect(thirdCat).toHaveText('ID 3. Mistoffelees');
    await expect(page.getByText('Success!')).toBeVisible();
});

test('TEST-6-RETURN', async ({ page }) => { 
    await page.evaluate(() => {
    document.cookie = "2=true";
    document.cookie = "3=true";
  });
    await page.reload();

    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to return:' }).fill('2');
    await page.getByRole('button', { name: 'Return' }).click();

    const firstCat = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem').nth(0);
    await expect(firstCat).toHaveText('ID 1. Jennyanydots');
    const secondCat = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem').nth(1);
    await expect(secondCat).toHaveText('ID 2. Old Deuteronomy');
    const thirdCat = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem').nth(2);
    await expect(thirdCat).toHaveText('Rented out');
    await expect(page.getByText('Success!')).toBeVisible();

});

test('TEST-7-FEED-A-CAT', async ({ page }) => { 
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => { 
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).fill('6');
    await page.getByRole('button', { name: 'Feed' }).click();
    await expect(page.getByText('Nom, nom, nom.')).toBeVisible({ timeout: 10_000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => { 
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
    await expect(page.getByText('Meow!Meow!Meow!')).toBeVisible();
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => { 
    await page.goto(`${appUrl}greet-a-cat/Jennyanydots`);
    await expect(page.getByText('Meow! from Jennyanydots.')).toBeVisible();
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => { 
    await page.evaluate(() => {
    document.cookie = "1=true";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });
    await page.reload();

    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    
    await expect(page.locator('body')).toHaveScreenshot();
});

// test('DEFECT1-GREET-A-CAT', async ({ page }) => {
//     await page.evaluate(() => {
//         document.cookie = "1=true";
//     });
//     await page.reload(); 
//     await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
//     await expect(page.getByText('Meow!Meow!', { exact: true })).toBeVisible();
// });

// test('DEFECT2-GREET-A-CAT-WITH-NAME', async ({ page }) => {
//     await page.evaluate(() => {
//         document.cookie = "1=true";
//     });
//     await page.reload(); 

//     await page.goto(`${appUrl}greet-a-cat/Jennyanydots`);
//     await expect(page.getByText('Jennyanydots is not here.')).toBeVisible();
// });

// test('DEFECT3-CATALOG', async ({ page }) => { 
//     await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
//     await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).fill('9999999999999999');
//     await page.getByRole('button', { name: 'Feed' }).click();
//     await expect(page.getByText('Nom, nom, nom.')).toBeVisible({ timeout: 10_000 });
// });