require('dotenv').config();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

async function test() {
  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: 'test-user' },
      client_name: 'FinDash',
      products: ['transactions'],
      country_codes: ['BR'],
      language: 'pt',
    });
    console.log('SUCCESS BR:', response.data);
  } catch (error) {
    console.error('ERROR BR:', error.response?.data || error.message);
    try {
        const response2 = await client.linkTokenCreate({
          user: { client_user_id: 'test-user' },
          client_name: 'FinDash',
          products: ['transactions'],
          country_codes: ['US'],
          language: 'en',
        });
        console.log('SUCCESS US:', response2.data);
    } catch (err2) {
        console.error('ERROR US:', err2.response?.data || err2.message);
    }
  }
}

test();
