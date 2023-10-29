export interface networkConfigItem {
    name: string
    ethUsdPriceFeed?: string
    blockConfirmations?: number
}

export interface networkConfigInfo {
    [key: number]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: 'localhost'
    },
    11155111: {
        name: 'sepolia',
        ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306'
    }
}

export const developmentChains = ['hardhat', 'localhost']
