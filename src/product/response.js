/**
 * @typedef {Object} ResponseProps
 * @property {Omit<typeof import('./index.js'), 'response'>} index
 * @property {Record<string, string>} queryString
 */

/**
 * @param {ResponseProps} options
 */
export async function response({ index, queryString }) {
  return {
    pricing_strategy_engine_version: 3,
    config: {
      tax_rate: 0.19,
    },
    payment_plans: [
      {
        id: 'pp_123',
        payment_providers: [
          {
            method: 'creditcard',
            type: 'stripe_intents',
            field_definition: [],
            keys: {
              // To test stripe payments, change this to your stripe test key
              public_key: 'pk_test_EXAMPLE',
            },
          },
          {
            method: 'paypal',
            type: 'paypal_direct',
            field_definition: [],
            keys: {
              public_key: null,
            },
          },
        ],
      },
    ],
    assets: [],

    content: index.contents[queryString.language],
    manifest: index.manifest,
    field_definition: {
      ...index.fieldDefinition,
      ...index.pricingFieldDefinition.definition,
    },
  };
}
