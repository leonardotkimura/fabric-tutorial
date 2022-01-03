const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs')
const { X509Certificate } = require('crypto')
const jsrsasign = require('jsrsasign')


class ConnectService {
  constructor() {
    this.walletPath = path.join(process.cwd(), 'fabric-interface/wallet');
    
  }
  
  async connectNetwork(channel, chaincode) {
    const wallet = await Wallets.newFileSystemWallet(this.walletPath);
    console.log(`Wallet path: ${this.walletPath}`);

    const connectionProfilePath = path.resolve(__dirname, '..', 'fabric-interface', 'connection-org1.json');
    let connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8'));

    const gateway = new Gateway();
    let connectionOptions = { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true }};
    await gateway.connect(connectionProfile, connectionOptions);

    const network = await gateway.getNetwork(channel);
    const contract = network.getContract(chaincode);

    return { network, contract, gateway }
 }

  async getMyAddress() {
    const wallet = await Wallets.newFileSystemWallet(this.walletPath);
    const id =  await wallet.get('userCertificate')
    if(id){
      var x509 = new jsrsasign.X509()
      x509.readCertPEM(id.credentials.certificate)
      const fingerprint256 = jsrsasign.KJUR.crypto.Util.sha256(x509.hex)
      return fingerprint256
    }
  }
}

module.exports = ConnectService;
