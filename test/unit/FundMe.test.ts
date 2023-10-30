import { ethers, deployments, getNamedAccounts } from 'hardhat'
import { FundMe, MockV3Aggregator } from '../../typechain-types'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { assert } from 'chai'

describe('FundMe', () => {
    let fundMe: FundMe
    let mockV3Aggregator: MockV3Aggregator
    let deployer: SignerWithAddress

    beforeEach(async () => {
        const accounts = await ethers.getSigners()

        deployer = accounts[0]

        await deployments.fixture(['all'])

        fundMe = await ethers.getContract('FundMe', deployer)
        mockV3Aggregator = await ethers.getContract(
            'MockV3Aggregator',
            deployer
        )
    })

    describe('constructor', async () => {
        it('sets the aggregator addresses correctly', async () => {
            const response = await fundMe.priceFeed()
            const mockAddress = await mockV3Aggregator.getAddress()

            assert.equal(response, mockAddress)
        })
    })
})
