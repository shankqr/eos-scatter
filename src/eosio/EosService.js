import { Api, JsonRpc } from 'eosjs';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';

const endpoint = 'https://api.kylin.alohaeos.com:443'; // kylin
const network = {
  blockchain: 'eos',
  protocol: 'https',
  host: 'api.kylin.alohaeos.com',
  port: 443,
  chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
};

class EosService {
  constructor(dappName, contractAccount) {
    this.dappName = dappName;
    this.contractAccount = contractAccount;
    ScatterJS.plugins(new ScatterEOS());
    this.rpc = new JsonRpc(endpoint);
    window.ScatterJS = null;
  }

  connect = async () => {
    await ScatterJS.scatter.connect(this.dappName).then(connected => {
      if (!connected) return console.log('Failed to connect with Scatter!');
      this.scatter = ScatterJS.scatter;
    });

    await this.scatter.getIdentity({ accounts: [network] }).then(() => {
      this.account = this.scatter.identity.accounts.find(
        e => e.blockchain === 'eos'
      );
    });

    if (this.account === null) return false;

    return true;
  };

  transaction = async (action, data) => {
    this.api = this.scatter.eos(network, Api, { rpc: this.rpc });

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
              ...data
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
    return true;
  };
}

export default EosService;
