import { HardhatUserConfig } from 'hardhat/config'

import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'
import '@nomicfoundation/hardhat-ethers'
import '@nomiclabs/hardhat-solhint'
import 'hardhat-deploy'
import '@typechain/hardhat'
import 'solidity-coverage'
import 'hardhat-gas-reporter'
import 'dotenv/config'

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ''

const config: HardhatUserConfig = {
    defaultNetwork: 'hardhat',
    networks: {
        sepolia: {
            chainId: 11155111,
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY]
        },
        localhost: {
            chainId: 31337,
            url: 'http://127.0.0.1:8545/'
        }
    },
    solidity: {
        compilers: [{ version: '0.8.8' }, { version: '0.6.6' }]
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    gasReporter: {
        enabled: true,
        outputFile: 'gas-report.txt',
        noColors: true,
        currency: 'USD',
        coinmarketcap: COINMARKETCAP_API_KEY
    },
    namedAccounts: {
        deployer: {
            default: 0
        }
    }
}

export default config
