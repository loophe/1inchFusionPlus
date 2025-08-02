// import {z} from 'zod'
// import Sdk from '@1inch/cross-chain-sdk'
import dotenv from "dotenv"

dotenv.config({ path: '.env' })

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
// import * as process from 'node:process'

// const bool = z
//     .string()
//     .transform((v) => v.toLowerCase() === 'true')
//     .pipe(z.boolean())

// const ConfigSchema = z.object({
//     SRC_CHAIN_RPC: z.string().url(),
//     DST_CHAIN_RPC: z.string().url(),
//     SRC_CHAIN_CREATE_FORK: bool.default('true'),
//     DST_CHAIN_CREATE_FORK: bool.default('true')
// })

// const fromEnv = ConfigSchema.parse(process.env)

export const config = {
    chain: {
        source: {
            chainId: NetworkEnum.ETHEREUM,
            url: process.env.SRC_CHAIN_RPC,
            createFork: process.env.SRC_CHAIN_CREATE_FORK,
            limitOrderProtocol: '0x111111125421ca6dc452d289314280a0f8842a65',
            wrappedNative: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            ownerPrivateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
            tokens: {
                USDC: {
                    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                    donor: '0xd54F23BE482D9A58676590fCa79c8E43087f92fB'
                }
            }
        },
        destination: {
            chainId: NetworkEnum.OPTIMISM,
            url: process.env.DST_CHAIN_RPC,
            createFork: process.env.DST_CHAIN_CREATE_FORK,
            limitOrderProtocol: '0x111111125421ca6dc452d289314280a0f8842a65',
            wrappedNative: '0x4200000000000000000000000000000000000042',
            ownerPrivateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
            tokens: {
                USDC: {
                    address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
                    donor: '0x133FA49A01801264fC05A12EF5ef9Db6a302e93D'
                }
            }
        }
    }
} as const

export type ChainConfig = (typeof config.chain)['source' | 'destination']