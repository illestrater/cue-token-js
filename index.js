const { LocalAddress, CryptoUtils } = require('loom-js');

const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');
const shamir = require('secrets.js-grempe');
const plasma = require('./plasmaContracts');

const { toHexString, mnemonicToSeed, buildPrivateKeyShamir } = require('./utils');
const {
  mapAccounts, getMainnetBalance, getMainnetCUEBalance, withdrawCUE
} = require('./tokenFunctions');

function generateMnemonic() {
  return bip39.generateMnemonic();
}

function generateLoomPrivateKeyShamir(mnemonic) {
  const seed = mnemonicToSeed(mnemonic);
  const privateKey = CryptoUtils.generatePrivateKeyFromSeed(seed);
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
  console.log('LOOM PUBLIC KEY', LocalAddress.fromPublicKey(publicKey).toString());

  const privateKeyHex = toHexString(privateKey);
  const shares = shamir.share(privateKeyHex, 2, 2);
  return shares;
}

function generateEthereumPrivateKeyShamir(mnemonic) {
  const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
  const walletHdPath = "m/44'/60'/0'/0/";
  const wallet = hdwallet.derivePath(`${ walletHdPath }0`).getWallet();

  const privateKey = wallet.getPrivateKey().toString('hex');
  const publicKey = `0x${ wallet.getAddress().toString('hex') }`;
  console.log('ETHEREUM PUBLIC KEY', publicKey);

  const shares = shamir.share(privateKey, 2, 2);
  return shares;
}

exports.GenerateMnemonic = generateMnemonic;
exports.GenerateLoomPrivateKeyShamir = generateLoomPrivateKeyShamir;
exports.GenerateEthereumPrivateKeyShamir = generateEthereumPrivateKeyShamir;
exports.BuildPrivateKeyShamir = buildPrivateKeyShamir;

exports.PlasmaContracts = plasma.PlasmaContracts;
exports.MapAccounts = mapAccounts;
exports.GetMainnetBalance = getMainnetBalance;
exports.GetMainnetCUEBalance = getMainnetCUEBalance;
exports.WithdrawCUE = withdrawCUE;
