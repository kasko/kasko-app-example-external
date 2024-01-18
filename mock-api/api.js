import { mockApi } from '@kasko/fe-webapp-utils-lib/server';

// A way to proxy any request to a qa instance
/** @type {import("@kasko/fe-webapp-utils-lib/server").MockedAPIMiddleware} */
const proxy = (req, res) => {
  res.writeHead(307, { Location: `https://api.qa-ats.eu1.kaskoqa.com${req.url}` });
  res.end();
};

export default mockApi({
  // 'POST /quotes': proxy,

  'POST /quotes': async (_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        gross_premium: Math.ceil(Math.random() * 10000),
        currency: 'eur',
        net_premium: 984,
        net_service_fee_total: 0,
        premium_tax: 187,
        service_charge_vat: 0,
        tax_rate: 0.19,
        signature: 'quote_token',
        // extra_data: {
        //   before_discount: 1000,
        // },
      }),
    );
  },
});
