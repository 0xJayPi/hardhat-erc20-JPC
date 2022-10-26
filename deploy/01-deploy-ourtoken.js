const { getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function () {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //const chainId = network.config.chainId
    const INITIAL_SUPPLY = ethers.utils.parseEther("10000")
    const arguments = [INITIAL_SUPPLY]

    const ourToken = await deploy("OurToken", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying contract...")
        await verify(ourToken.address, arguments)
    }
}

module.exports.tags = ["all"]
