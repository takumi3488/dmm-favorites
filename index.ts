import { chromium } from "playwright";
import auth from "./auth";

const url = "https://book.dmm.co.jp/bookmark/?view=list";

type Item = {
  title: string;
  price: number;
  cashback: number;
};

const main = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(
    "https://www.dmm.co.jp/age_check/=/declared=yes/?rurl=https%3A%2F%2Fbook.dmm.co.jp%2Fbookmark%2F%3Fview%3Dlist"
  );
  await page.fill("input#login_id", auth.email);
  await page.fill("input#password", auth.password);
  await page.click("[value='ログイン']");
  await page.waitForURL(url);
  const table = await page.waitForSelector("table[summary='商品一覧']");
  const rows = await table.$$("tr.odd, tr.even");
  const urls: string[] = [];
  for (const row of rows) {
    const sale = await row.$(".tx-sp");
    const cashback = await row.$(".ico-st-cashback");
    if (sale || cashback) {
      const a_tag = await row.$("a");
      const url = await a_tag?.getAttribute("href");
      if (url) urls.push(url);
    }
  }
  const items: Item[] = [];
  for (const url of urls) {
    await page.goto(url);
    const title = await page.innerText("h1#title");
    const price = +(
      (await page.innerText(
        "dt.m-boxSubDetailPurchase__price__value"
      )) as string
    )
      .slice(0, -1)
      .replace(",", "");
    const cashback = await page.$$eval(
      "dl.m-boxMainDetailPurchase__areaPoint__item>dd",
      (dds) => {
        let cashback = 0;
        dds.forEach((dd) => {
          cashback += +(dd as HTMLElement).innerText
            .slice(0, -4)
            .replace(",", "");
        });
        return cashback;
      }
    );
    items.push({ title, price, cashback });
  }
  items.sort((a, b) => {
    if (a.cashback < b.cashback) return 1;
    return -1;
  });
  let payment = 0;
  let point = 0;
  console.log("還元ポイントが多い順に出力")
  items.forEach((item) => {
    console.log(item.title)
    if (item.price <= point) {
      point -= item.price;
    } else {
      payment += item.price - point;
      point = item.cashback;
    }
  });
  console.log(`合計金額: ${payment}円, 残りポイント: ${point}`);

  await browser.close();
};

main();
