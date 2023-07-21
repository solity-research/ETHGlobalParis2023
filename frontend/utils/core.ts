import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'

const core = new Core({
  projectId: process.env.PROJECT_ID
})

const web3wallet = Web3Wallet.init({
  core, // <- pass the shared `core` instance
  metadata: {
    name: 'mycredit',
    description: 'A credit score app',
    url: 'www.walletconnect.com',
    icons: []
  }
})