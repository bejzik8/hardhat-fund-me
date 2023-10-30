import { ethers, deployments, getNamedAccounts } from 'hardhat'
import { FundMe, MockV3Aggregator } from '../../typechain-types'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { assert, expect } from 'chai'
import { ContractTransactionReceipt } from 'ethers'

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

    describe('withdraw', async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })

        it('withdraw ETH from a single funder', async () => {
            // Arrange

            fundMe.connect(deployer)

            const fundMeAddress = await fundMe.getAddress()

            const startingFundMeBalance =
                await ethers.provider.getBalance(fundMeAddress)

            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            )

            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = (await transactionResponse.wait(
                1
            )) as ContractTransactionReceipt

            const { gasUsed, gasPrice } = transactionReceipt

            const gasCost = gasUsed * gasPrice

            const endingFundMeBalance =
                await ethers.provider.getBalance(fundMeAddress)
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            )

            // Assert
            assert.equal(endingFundMeBalance.toString(), '0')
            assert.equal(
                startingFundMeBalance + startingDeployerBalance,
                endingDeployerBalance + gasCost
            )
        })
    })
})
