import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';

const endpoint2 = 'https://api.kylin.alohaeos.com:443'; // kylin
const network2 = {
  blockchain: 'eos',
  protocol: 'https',
  host: 'api.kylin.alohaeos.com',
  port: 443,
  chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
};

const endpoint = 'http://jungle2.cryptolions.io:80'; // Jungle
const network = {
  blockchain: 'eos',
  protocol: 'http',
  host: 'jungle2.cryptolions.io',
  port: 80,
  chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473' // Jungle
};

class EosService {
  constructor(contractAccount) {
    this.contractAccount = contractAccount;

    ScatterJS.plugins(new ScatterEOS());

    try {
      ScatterJS.scatter.connect(this.contractAccount).then(connected => {
        if (!connected) return console.log('Issue Connecting');
        const scatter = ScatterJS.scatter;
        const requiredFields = {
          accounts: [network] // We defined this above
        };
        scatter.getIdentity(requiredFields).then(() => {
          this.account = scatter.identity.accounts.find(
            x => x.blockchain === 'eos'
          );

          const rpc = new JsonRpc(endpoint);

          /*
          const privateKey =
            '5HyYW9fLXZt3isexTKRq7v3uzziiqwJ2Sxpp3P1msuAApE7ibWC';
          const signatureProvider = new JsSignatureProvider([privateKey]);

          this.api = new Api({
            rpc,
            signatureProvider,
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder()
          });
          */

          this.api = scatter.eos(network, Api, { rpc });

          this.transaction('login');
        });
        window.ScatterJS = null;
      });
    } catch (error) {
      console.log(error);
    }
  }

  transaction = async action => {
    console.log(this.api);
    console.log(this.contractAccount);
    console.log(this.account.name);
    console.log(this.account.authority);

    const resultWithConfig = await this.api.transact(
      {
        actions: [
          {
            account: this.contractAccount,
            name: action,
            authorization: [
              {
                actor: this.account.name,
                permission: this.account.authority
              }
            ],
            data: {
              user: this.account.name
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
    console.log(resultWithConfig);
  };
}

export default EosService;
