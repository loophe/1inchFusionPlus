import {config} from './config'

import {createServer, CreateServerReturnType} from 'prool'
import assert from 'node:assert'
// import {anvil} from 'prool/instances'

import {
    computeAddress,
    ContractFactory,
    JsonRpcProvider,
    MaxUint256,
    parseEther,
    parseUnits,
    randomBytes,
    Wallet
} from 'ethers'
import factoryContract from './lib/ABI/EscrowFactory.json'
import resolverContract from './lib/ABI/Resolver.json'
import {Address} from '@1inch/cross-chain-sdk'

export type ChainConfig = (typeof config.chain)['source' | 'destination']

async function getProvider(cnf: ChainConfig): Promise<{provider: JsonRpcProvider}> {
    // if (!cnf.createFork) {
    //     return {
    //         provider: new JsonRpcProvider(cnf.url, cnf.chainId, {
    //             cacheTimeout: -1,
    //             staticNetwork: true
    //         })
    //     }
    // }

    // const node = createServer({
    //     instance: anvil({forkUrl: cnf.url, chainId: cnf.chainId}),
    //     limit: 1
    // })
    // await node.start()

    // const address = node.address()
    // assert(address)
    console.log(`Connecting to ${cnf.url} with chainId ${cnf.chainId}`)
    const provider = new JsonRpcProvider(`${cnf.url}`, cnf.chainId, {
        cacheTimeout: -1,
        staticNetwork: true
    })

    return {
        provider
    
    }
}
const resolverPk = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'

export async function initChain(
    cnf: ChainConfig
): Promise<{node?: CreateServerReturnType; provider: JsonRpcProvider; escrowFactory: string; resolver: string}> {
// ): Promise<{node?: CreateServerReturnType}> {
    const {provider} = await getProvider(cnf)
    const deployer = new Wallet(cnf.ownerPrivateKey, provider)
    // console.log("console.log(Address.fromBigInt(0n).toString()) :"+Address.fromBigInt(0n).toString())
    //deploy EscrowFactory
    const escrowFactory = await deploy(
        factoryContract,
        [
            cnf.limitOrderProtocol,
            cnf.wrappedNative, // feeToken,
            Address.fromBigInt(0n).toString(), // accessToken,
            deployer.address, // owner
            60 * 30, // src rescue delay
            60 * 30 // dst rescue delay
        ],
        provider,
        deployer
    )
    // // console.log(Address.fromBigInt(0n).toString())
    console.log(`[${cnf.chainId}]`, `Escrow factory contract deployed to`, escrowFactory)

    //deploy Resolver contract
    const resolver = await deploy(
        resolverContract,
        [
            escrowFactory,
            cnf.limitOrderProtocol,
            computeAddress(resolverPk) // resolver as owner of contract
        ],
        provider,
        deployer
    )
    console.log(`[${cnf.chainId}]`, `Resolver contract deployed to`, resolver)
    // return {node: node}

    
    return {provider, resolver, escrowFactory}
}

/**
 * Deploy contract and return its address
 */
async function deploy(
    json: {abi: any; bytecode: any},
    params: unknown[],
    provider: JsonRpcProvider,
    deployer: Wallet
): Promise<string> {
    const deployed = await new ContractFactory(json.abi, json.bytecode, deployer).deploy(...params)
    await deployed.waitForDeployment()

    return await deployed.getAddress()
}
