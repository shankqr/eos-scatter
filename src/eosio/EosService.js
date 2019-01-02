import { Api, JsonRpc } from 'eosjs';

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';

// Don't forget to tell ScatterJS which plugins you are using.
ScatterJS.plugins(new ScatterEOS());

// Networks are used to reference certain blockchains.
// They let you get accounts and help you build signature providers.
const network = {
  blockchain: 'eos',
  protocol: 'https',
  host: 'api.kylin.alohaeos.com',
  port: 443,
  chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
};

async function getScatter() {
  // First we need to connect to the user's Scatter.
  ScatterJS.scatter.connect('My EOS Dapp').then(connected => {
    // If the user does not have Scatter or it is Locked or Closed this will return false;
    //if (!connected) return false;

    const scatter = ScatterJS.scatter;

    // Now we need to get an identity from the user.
    // We're also going to require an account that is connected to the network we're using.
    const requiredFields = { accounts: [network] };
    scatter
      .getIdentity(requiredFields)
      .then(() => {
        // Always use the accounts you got back from Scatter. Never hardcode them even if you are prompting
        // the user for their account name beforehand. They could still give you a different account.
        const account = scatter.identity.accounts.find(
          x => x.blockchain === 'eos'
        );

        // You can pass in any additional options you want into the eosjs reference.
        const eosOptions = { expireInSeconds: 60 };

        // Get a proxy reference to eosjs which you can use to sign transactions with a user's Scatter.
        //const eos = scatter.eos(network, Eos, eosOptions);

        // ----------------------------
        // Now that we have an identity,
        // an EOSIO account, and a reference
        // to an eosjs object we can send a transaction.
        // ----------------------------

        // Never assume the account's permission/authority. Always take it from the returned account.
        const transactionOptions = {
          authorization: [`${account.name}@${account.authority}`]
        };

        invokeAction('login', scatter.eosHook(network), account.name)
          .then(resultWithConfig => {
            return resultWithConfig;
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(error => {
        // The user rejected this request, or doesn't have the appropriate requirements.
        console.error(error);
        throw error;
      });
  });
}

async function invokeAction(action, signatureProvider, acc) {
  const rpc = new JsonRpc(process.env.VUE_APP_NODE_ENDPOINT);

  const api = new Api({
    rpc,
    signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder()
  });

  try {
    const resultWithConfig = await api.transact(
      {
        actions: [
          {
            account: process.env.VUE_APP_SMART_CONTRACT_NAME,
            name: action,
            authorization: [
              {
                actor: acc,
                permission: 'active'
              }
            ],
            data: { user: acc }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
    return resultWithConfig;
  } catch (err) {
    throw err;
  }
}

class EosService {
  static login() {
    return new Promise((resolve, reject) => {
      getScatter()
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export default EosService;
