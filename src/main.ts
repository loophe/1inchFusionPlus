// import Sdk from '@1inch/cross-chain-sdk'
import { createOrder } from './lib/create-order';
import {Wallet} from './wallet';
import {ChainConfig, config} from './config'
import {Resolver} from './resolver'
import {initChain} from './initChain';
// import {anvil} from 'prool/instances'
import {
    computeAddress,
    ContractFactory,
    JsonRpcProvider,
    MaxUint256,
    parseEther,
    parseUnits,
    randomBytes,
    Wallet as SignerWallet,
    Provider
} from 'ethers'

import {uint8ArrayToHex, UINT_40_MAX} from '@1inch/byte-utils'

import {  
    HashLock,  
    TimeLocks,
    NetworkEnum,  
    OrderStatus,  
    PresetEnum,  
    PrivateKeyProviderConnector,  
    SDK,
    CrossChainOrder ,
    randBigInt,
    Address,
    AuctionDetails,
    TakerTraits,
    AmountMode
} from '@1inch/cross-chain-sdk' 
// import { time } from 'console'
import {Chain} from './lib/create-order'
import {EscrowFactory} from './lib/escrow-factory'
// console.log(NetworkEnum.BINANCE)
const secret = uint8ArrayToHex(randomBytes(32))
console.log('secret', secret)

async function main() {
 
	const userPk = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
    const resolverPk = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'

	const srcChainId = NetworkEnum.ETHEREUM;
	const dstChainId = NetworkEnum.OPTIMISM;


    let src: Chain
    let dst: Chain
    let srcFactory: EscrowFactory


    // init 1/
	;[src, dst] = await Promise.all([initChain(config.chain.source), initChain(config.chain.destination)])
	const srcChainUser = new Wallet(userPk, src.provider)
    
    const dstChainResolver = new Wallet(resolverPk, dst.provider)
    const srcChainResolver = new Wallet(resolverPk, src.provider)
    // get 1000 USDC for user in SRC chain and approve to LOP
    await srcChainUser.topUpFromDonor(
        config.chain.source.tokens.USDC.address,
        config.chain.source.tokens.USDC.donor,
        parseUnits('1000', 6)
    )

    const balace = await srcChainUser.tokenBalance(config.chain.source.tokens.USDC.address)
    const bal = await src.provider.getBalance(await srcChainUser.getAddress())
    console.log(`User ETH balance:`, bal.toString())
    console.log(`User ${await srcChainUser.getAddress()} balance:`, balace.toString())
    // approve LOP to spend USDC
    console.log('Approving LOP to spend USDC...')
    await srcChainUser.approveToken(
        config.chain.source.tokens.USDC.address,
        config.chain.source.limitOrderProtocol,
        MaxUint256
    )


    // get 2000 USDC for resolver in DST chain
        // srcResolverContract = await Wallet.fromAddress(src.resolver, src.provider)
    const dstResolverContract = await Wallet.fromAddress(dst.resolver, dst.provider)
        await dstResolverContract.topUpFromDonor(
            config.chain.destination.tokens.USDC.address,
            config.chain.destination.tokens.USDC.donor,
            parseUnits('2000', 6)
        )
    const dstBalance = await dstResolverContract.tokenBalance(config.chain.destination.tokens.USDC.address)
    console.log(`DST Resolver USDC balance:`, dstBalance.toString())
    // top up contract for approve
        await dstChainResolver.transfer(dst.resolver, parseEther('1'))
        await dstResolverContract.unlimitedApprove(config.chain.destination.tokens.USDC.address, dst.escrowFactory)
    console.log('Approving escrow factory to spend USDC...')
    
    // create_order 2/
    const order = await createOrder(
            src,
			'EVM',
			await srcChainUser.getAddress(),
            new Address(config.chain.source.tokens.USDC.address),
			new Address(config.chain.destination.tokens.USDC.address),			
			srcChainId,
			dstChainId,
			secret
		);

    // console.log(`\n🎈`, order);

    const orderHash = order.getOrderHash(1)
    // console.log('orderHash :', orderHash)

    // SIGN ORDER 3/
    const signature = await srcChainUser.signOrder(srcChainId, order);
    // console.log("User signature :"+signature)

    console.log('🎈', signature, orderHash);


    //fill order 4/
    
    const fillAmount = order.makingAmount
    const resolverContract = new Resolver(src.resolver, dst.resolver)
    // console.log("
    const {txHash: orderFillHash, blockHash: srcDeployBlock} = await srcChainResolver.send(//1/2
        resolverContract.deploySrc(
            srcChainId,
            order,
            signature,
            TakerTraits.default()
                .setExtension(order.extension)
                .setAmountMode(AmountMode.maker)
                .setAmountThreshold(order.takingAmount),
            fillAmount
        )
    )

    console.log(`[${srcChainId}]`, `Order ${orderHash} filled for ${fillAmount} in tx ${orderFillHash}`)

    srcFactory = new EscrowFactory(src.provider, src.escrowFactory)
    const srcEscrowEvent = await srcFactory.getSrcDeployEvent(srcDeployBlock)
    console.log('stcEscrowEvent :', srcEscrowEvent )
    const dstImmutables = srcEscrowEvent[0]
        .withComplement(srcEscrowEvent[1])
        .withTaker(new Address(resolverContract.dstAddress))

    console.log(`[${dstChainId}]`, `Depositing ${dstImmutables.amount} for order ${orderHash}`)


    const {txHash: dstDepositHash, blockTimestamp: dstDeployedAt} = await dstChainResolver.send(//2/2
                resolverContract.deployDst(dstImmutables)
            )
    console.log(`[${dstChainId}]`, `Created dst deposit for order ${orderHash} in tx ${dstDepositHash}`)
}
main().catch(console.error);
