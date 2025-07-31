import Sdk from '@1inch/cross-chain-sdk'

describe('Resolving example', () => {
    beforeAll(async () => {
        // ;[src, dst] = await Promise.all([initChain(config.chain.source), initChain(config.chain.destination)])

        // srcChainUser = new Wallet(userPk, src.provider)
        // dstChainUser = new Wallet(userPk, dst.provider)
        // srcChainResolver = new Wallet(resolverPk, src.provider)
        // dstChainResolver = new Wallet(resolverPk, dst.provider)

        // srcFactory = new EscrowFactory(src.provider, src.escrowFactory)
        // dstFactory = new EscrowFactory(dst.provider, dst.escrowFactory)
        // // get 1000 USDC for user in SRC chain and approve to LOP
        // await srcChainUser.topUpFromDonor(
        //     config.chain.source.tokens.USDC.address,
        //     config.chain.source.tokens.USDC.donor,
        //     parseUnits('1000', 6)
        // )
        // await srcChainUser.approveToken(
        //     config.chain.source.tokens.USDC.address,
        //     config.chain.source.limitOrderProtocol,
        //     MaxUint256
        // )

        // // get 2000 USDC for resolver in DST chain
        // srcResolverContract = await Wallet.fromAddress(src.resolver, src.provider)
        // dstResolverContract = await Wallet.fromAddress(dst.resolver, dst.provider)
        // await dstResolverContract.topUpFromDonor(
        //     config.chain.destination.tokens.USDC.address,
        //     config.chain.destination.tokens.USDC.donor,
        //     parseUnits('2000', 6)
        // )
        // // top up contract for approve
        // await dstChainResolver.transfer(dst.resolver, parseEther('1'))
        // await dstResolverContract.unlimitedApprove(config.chain.destination.tokens.USDC.address, dst.escrowFactory)

        // srcTimestamp = BigInt((await src.provider.getBlock('latest'))!.timestamp)
    })

    // async function getBalances(
    //     srcToken: string,
    //     dstToken: string
    // ): Promise<{src: {user: bigint; resolver: bigint}; dst: {user: bigint; resolver: bigint}}> {
    //     return {
    //         src: {
    //             user: await srcChainUser.tokenBalance(srcToken),
    //             resolver: await srcResolverContract.tokenBalance(srcToken)
    //         },
    //         dst: {
    //             user: await dstChainUser.tokenBalance(dstToken),
    //             resolver: await dstResolverContract.tokenBalance(dstToken)
    //         }
    //     }
    // }

    afterAll(async () => {
        // src.provider.destroy()
        // dst.provider.destroy()
        // await Promise.all([src.node?.stop(), dst.node?.stop()])
    })

    describe('Cross-chain resolving', () => {   })
})