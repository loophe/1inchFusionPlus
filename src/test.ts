// import Sdk from '@1inch/cross-chain-sdk'
import { createOrder } from './lib/create-order';
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
// // const ord = Sdk.CrossChainOrder.new({

const secret = uint8ArrayToHex(randomBytes(32))
console.log('secret', secret)

// const hashLock = Sdk.HashLock.forSingleFill(secret) 
// Sdk.HashLock
// console.log(Sdk.NetworkEnum.BINANCE)
// Sdk


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
    AuctionDetails
} from '@1inch/cross-chain-sdk' 
import { time } from 'console'


console.log(NetworkEnum.BINANCE)
const hashLock = HashLock.forSingleFill(secret)
// console.log(hashLock)

const timeLocks = TimeLocks.new({
                        srcWithdrawal: 10n, // 10sec finality lock for test
                        srcPublicWithdrawal: 120n, // 2m for private withdrawal
                        srcCancellation: 121n, // 1sec public withdrawal
                        srcPublicCancellation: 122n, // 1sec private cancellation
                        dstWithdrawal: 10n, // 10sec finality lock for test
                        dstPublicWithdrawal: 100n, // 100sec private withdrawal
                        dstCancellation: 101n // 1sec public withdrawal
                    })
// console.log(timeLocks)

// const provider = new JsonRpcProvider('http://[::]:41225/1',1,
//     {
//         cacheTimeout: -1,
//         staticNetwork: true
//     }) 
// provider.getBlockNumber().then((blockNumber) => {
//     console.log('blockNumber', blockNumber)
async function main() {
    // const order = CrossChainOrder.new(
	// 	new Address("0x4Df2b6836e11c63b7D762868979e14Df481F09a7"),
	// 	{
	// 		salt: randBigInt(1000n),
	// 		maker: new Address("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
	// 		makingAmount: parseUnits('100', 6), // TODO: CHANGE VALUE
	// 		takingAmount: parseUnits('99', 6), // TODO: CHANGE VALUE
	// 		makerAsset: new Address("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
	// 		takerAsset: new Address("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
	// 	},
	// 	{
	// 		hashLock: hashLock,
	// 		timeLocks: timeLocks,
	// 		srcChainId: 1,
	// 		dstChainId: 137,
	// 		srcSafetyDeposit: parseEther('0.001'),
	// 		dstSafetyDeposit: parseEther('0.001'),
	// 	},
	// 	{
	// 		auction: new AuctionDetails({
	// 			initialRateBump: 0,
	// 			points: [],
	// 			duration: 120n,
	// 			startTime: 100n,
	// 		}),
	// 		whitelist: [
	// 			{
	// 				address: new Address("0xb7aCdc1Ae11554dfe98aA8791DCEE0F009155D5e"),
	// 				allowFrom: 0n,
	// 			},
	// 		],
	// 		resolvingStartTime: 0n,
	// 	},
	// 	{
	// 		nonce: randBigInt(UINT_40_MAX),
	// 		allowPartialFills: false,
	// 		allowMultipleFills: false,
	// 	}
	// );
    // console.log('order :', order)

    // const orderHash = order.getOrderHash(1)
    // console.log('orderHash :', orderHash)

    const order2 = await createOrder(
			'EVM',
			"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
			new Address("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
			new Address("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
			1,
			137,
			secret
		);

		// console.log(`\n🎈`, order2);

        const orderHash = order2.getOrderHash(1)
        console.log('orderHash :', orderHash)

	// 	// SIGN ORDER
	// 	const signature = await srcChainUser.signOrder(srcChainId, order);
	// 	const orderHash = order.getOrderHash(srcChainId);

	// 	console.log('🎈', signature, orderHash);
// }).catch((error) => {
//     console.error('Error fetching block number:', error)
// })

}
main().catch(console.error);
