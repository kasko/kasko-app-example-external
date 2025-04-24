import { randomUUID } from 'node:crypto';
import { mockApi } from '@kasko/fe-webapp-utils-lib/server';

// A way to proxy any request to a qa instance
/** @type {import("@kasko/fe-webapp-utils-lib/server").MockedAPIMiddleware} */
const proxy = (req, res) => {
  res.writeHead(307, { Location: `https://api.qa-ats.eu1.kaskoqa.com${req.url}` });
  res.end();
};

async function getBody(req) {
  try {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    return JSON.parse(Buffer.concat(buffers).toString());
  } catch (e) {
    return e;
  }
}

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

  'POST /v2/media': async (req, res, _params) => {
    const id = `med_${randomUUID().replace(/-/g, '')}`;
    const body = await getBody(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        id,
        is_uploaded: false,
        designation: body.designation,
        name: body.name,
        mime_type: body.mime_type,
        file_size: body.file_size,
      }),
    );
  },
  'POST /v2/media/:id/content': async (_req, res, _params) => {
    res.writeHead(204);
    res.end('');
  },
});
