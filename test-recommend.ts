import { callAPI } from './src/lib/aliexpress';

async function run() {
  try {
    const data = await callAPI('aliexpress.ds.recommend.feed.get', {
      country_sales: 'DE',
      target_currency: 'EUR',
      target_language: 'EN',
      page_no: '1',
      page_size: '10'
    });
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
run();
