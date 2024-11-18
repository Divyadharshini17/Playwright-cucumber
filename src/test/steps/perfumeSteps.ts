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
  await this.page.getByTestId('uc-accept-all-button').click();
  // Handle cookie acceptance only if necessary
//   const shadowRoot = await page.$('#usercentrics-root');
//   const acceptAllButton = await shadowRoot?.$('[data-testid="uc-accept-all-button"]');
//   await acceptAllButton?.click();
});

When('User navigate to perfume products', async function () {
  await this.page.getByTestId('header-component-item--navigation').getByRole('link', { name: 'PARFUM' }).click();
  await this.page.getByRole('link', { name: 'PARFUM', exact: true }).click();
  await this.page.locator(`//span[@data-testid='header-component-item--search']`).hover();
});

When('User apply the perfume filter for creatria "{string}"', async function (criteria: string) {
  await this.page.waitForLoadState('load');
  await this.page.getByTestId('flags').click();
  await this.page.getByRole('checkbox', { name: `${criteria}` }).click();
});

When('User apply the perfume filter for brand {string}', async function (brand: string) {
  await this.page.getByTestId('brand').click();
  await this.page.getByPlaceholder('Marke suchen').click();
  await this.page.getByPlaceholder('Marke suchen').fill(brand);
  await this.page.getByRole('checkbox', { name: `${brand}` }).click();
});
  
  When('User validate the brand details for "{string}"', async function (brand:string) {
  const mismatchedProducts: { brand: string }[] = [];
  const brandProducts = await page.locator(`//div[contains(text(),'${brand}')]`).elementHandles();

  for (const brandProduct of brandProducts) {
    try {
      const productBrand = await brandProduct.$eval('brand-selector', (el) => el.textContent?.trim() ?? '');
      if (productBrand !== brand) {
        mismatchedProducts.push({ brand: productBrand });
      }
    } catch (error) {
      console.error('Error retrieving brand for a product:', error);
    }
  }

  if (mismatchedProducts.length === 0) {
    console.log(`All products match the brand filter: ${brand}`);
  } else {
    console.error(`Some products do not match the brand filter: ${brand}`);
    console.table(mismatchedProducts);
  }
});

When('User filter by classification "{string}"', async function (classification: string) {
  await this.page.getByTestId('classificationClassName').click();
  await this.page.getByRole('checkbox', { name: `${classification}` }).click();
});

When('User validate the classification details for "{string}"', async function (classification: string) {
  const mismatchedProducts: { classification: string }[] = [];
  const products = await this.page.locator(`//div[contains(@class, 'product-classification')]`).elementHandles();

  for (const product of products) {
    try {
      const productClassification = await product.evaluate((el) => el.textContent?.trim() || '');
      if (productClassification !== classification) {
        mismatchedProducts.push({ classification: productClassification });
      }
    } catch (error) {
      console.error('Error retrieving classification for a product:', error);
    }
  }

  if (mismatchedProducts.length === 0) {
    console.log(`All products match the classification filter: ${classification}`);
  } else {
    console.error(`Some products do not match the classification filter: ${classification}`);
    console.table(mismatchedProducts);
  }
});

When('User apply filters for occasion "{string}"', async function (occasion: string) {
    await this.page.getByTestId('Geschenk für').click();
    await this.page.getByPlaceholder('Geschenk für suchen').fill(occasion);
    await this.page.getByRole('checkbox', { name: `${occasion}` }).click();
});

When('User apply the perfume filter for gender "{string}"', async function (gender: string) {
   await this.page.getByTestId('gender').click();
    await this.page.getByRole('checkbox', { name: `${gender}` }).click();
});

Then('User verify the product display for "{string}"', async function (product: string) {
  const productDetail = await this.page.getByTestId('details-link');
    await expect(productDetail).toContainText(productDetail);

});