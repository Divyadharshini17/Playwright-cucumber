import { Given, When, Then, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Page, Browser, expect } from '@playwright/test';

let page: Page;
let browser: Browser;
setDefaultTimeout(60000);

BeforeAll(async function () {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
});

AfterAll(async function () {
    await browser.close();
});

Given('User navigate to the homepage', async function () {
  await page.goto('https://www.douglas.de/de', { waitUntil: 'load' });
  //await this.page.getByTestId('uc-accept-all-button').click();
  // Handle cookie acceptance only if necessary
//   const shadowRoot = await page.$('#usercentrics-root');
//   const acceptAllButton = await shadowRoot?.$('[data-testid="uc-accept-all-button"]');
//   await acceptAllButton?.click();
});

When('User navigate to perfume products', async function () {
  await page.waitForLoadState('load');
  await page.getByRole('link', { name: 'PARFUM' }).first().click();
  await page.getByRole('link', { name: 'PARFUM', exact: true }).click();
  await page.locator(`//span[@data-testid='header-component-item--search']`).hover();
});

When('User apply the perfume filter for creatria "{string}"', async function (criteria: string) {
  await page.waitForLoadState('load');
  await page.getByTestId('flags').click();
  await page.getByRole('checkbox', { name: `${criteria}` }).click();
});

When('User apply the perfume filter for brand "{string}"', async function (brand: string) {
  await page.waitForLoadState('load');
  await page.getByPlaceholder('Marke suchen').click();
  await page.getByPlaceholder('Marke suchen').fill(brand);
  await page.getByRole('checkbox', { name: `${brand}` }).click();
});
  
  When('User validate the brand details for "{string}"', async function (expectedbrand:string) {
  const mismatchedProducts: { brand: string }[] = [];
  const brandProducts = await page.$$(`//div[contains(text(),'${expectedbrand}')]`);

  for (const brandProduct of brandProducts) {
    try {
      const brand = await brandProduct.$eval('brand-selector', (el) => el.textContent?.trim() ?? '');
      if (brand !== expectedbrand) {
        mismatchedProducts.push({ brand });
      }
    } catch (error) {
      console.error('Error retrieving brand for a product:', error);
    }
  }

  if (mismatchedProducts.length === 0) {
    console.log(`All products match the brand filter: ${expectedbrand}`);
  } else {
    console.error(`Some products do not match the brand filter: ${expectedbrand}`);
    console.table(mismatchedProducts);
  }
});

When('User filter by classification "{string}"', async function (classification: string) {
  await page.getByTestId('classificationClassName').click();
  await page.getByRole('checkbox', { name: `${classification}` }).click();
});

When('User validate the classification details for "{string}"', async function (expectedClassification: string) {
  const mismatchedProducts: { classification: string }[] = [];
  const products = await page.locator(`//div[contains(@class, 'product-classification')]`).elementHandles();

  for (const product of products) {
    try {
      const classification = await product.evaluate(el => el.textContent?.trim() || '');
      if (classification !== expectedClassification) {
        mismatchedProducts.push({ classification});
      }
    } catch (error) {
      console.error('Error retrieving classification for a product:', error);
    }
  }

  if (mismatchedProducts.length === 0) {
    console.log(`All products match the classification filter: ${expectedClassification}`);
  } else {
    console.error(`Some products do not match the classification filter: ${expectedClassification}`);
    console.table(mismatchedProducts);
  }
});

When('User apply filters for occasion "{string}"', async function (occasion: string) {
    await page.getByTestId('Geschenk für').click();
    await page.getByPlaceholder('Geschenk für suchen').fill(occasion);
    await page.getByRole('checkbox', { name: `${occasion}` }).click();
});

When('User apply the perfume filter for gender "{string}"', async function (gender: string) {
   await page.getByTestId('gender').click();
    await page.getByRole('checkbox', { name: `${gender}` }).click();
});

Then('User verify the product display for "{string}"', async function (expectedProductText: string) {
  const productDetail = await page.getByTestId('details-link');
    await expect(productDetail).toContainText(expectedProductText);

});