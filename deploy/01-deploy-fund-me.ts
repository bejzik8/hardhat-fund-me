import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { network } from 'hardhat'

import { developmentChains, networkConfig } from '../helper-hardhat.config'

const deployFunction: DeployFunction = async function ({
    getNamedAccounts,
    deployments
}: HardhatRuntimeEnvironment) {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId!

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get('MockV3Aggregator')
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }

    await deploy('FundMe', {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true
    })

    log('---------------------------')
}

export default deployFunction

deployFunction.tags = ['all', 'fundme']
