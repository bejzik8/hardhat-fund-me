import { ethers, deployments, getNamedAccounts } from 'hardhat'
import { FundMe, MockV3Aggregator } from '../../typechain-types'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { assert, expect } from 'chai'

describe('FundMe', () => {
    let fundMe: FundMe
    let mockV3Aggregator: MockV3Aggregator
    let deployer: SignerWithAddress
    const sendValue = ethers.parseEther('1')

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

    describe('fund', async () => {
        it("fails if you don' send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "Didn't send enough ETH!"
            )
        })

        it('updates the amount funded data structure', async () => {
            await fundMe.fund({ value: sendValue })

            const response = await fundMe.addressToAmountFunded(
                deployer.address
            )

            assert.equal(response.toString(), sendValue.toString())
        })

        it('adds funder to array of funders', async () => {
            await fundMe.fund({ value: sendValue })

            const funder = await fundMe.funders(0)

            assert.equal(funder, deployer.address)
        })
    })
})
