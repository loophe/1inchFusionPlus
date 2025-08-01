import { id, Interface, JsonRpcProvider } from 'ethers';
import Sdk, {Immutables,DstImmutablesComplement,HashLock,TimeLocks, Address} from '@1inch/cross-chain-sdk';
import EscrowFactoryContract from './ABI/EscrowFactory.json';

export class EscrowFactory {
	private iface = new Interface(EscrowFactoryContract.abi);

	constructor(
		private readonly provider: JsonRpcProvider,
		private readonly address: string
	) {}

	public async getSourceImpl(): Promise<Sdk.Address> {
		return Sdk.Address.fromBigInt(
			BigInt(
				await this.provider.call({
					to: this.address,
					data: id('ESCROW_SRC_IMPLEMENTATION()').slice(0, 10),
				})
			)
		);
	}

	// TODO: CHANGE DEST PART
	public async getDestinationImpl(): Promise<Sdk.Address> {
		return Sdk.Address.fromBigInt(
			BigInt(
				await this.provider.call({
					to: this.address,
					data: id('ESCROW_DST_IMPLEMENTATION()').slice(0, 10),
				})
			)
		);
	}

	public async getSrcDeployEvent(
		blockHash: string
	): Promise<[Sdk.Immutables, Sdk.DstImmutablesComplement]> {
		const event = this.iface.getEvent('SrcEscrowCreated')!;
		const logs = await this.provider.getLogs({
			blockHash,
			address: this.address,
			topics: [event.topicHash],
		});

		const [data] = logs.map((l) =>
			this.iface.decodeEventLog(event, l.data)
		);

		const immutables = data.at(0);
		const complement = data.at(1);

		return [
			Immutables.new({
				orderHash: immutables[0],
				hashLock: HashLock.fromString(immutables[1]),
				maker: Address.fromBigInt(immutables[2]),
				taker: Address.fromBigInt(immutables[3]),
				token: Address.fromBigInt(immutables[4]),
				amount: immutables[5],
				safetyDeposit: immutables[6],
				timeLocks: TimeLocks.fromBigInt(immutables[7]),
			}),
			DstImmutablesComplement.new({
				maker: Address.fromBigInt(complement[0]),
				amount: complement[1],
				token: Address.fromBigInt(complement[2]),
				safetyDeposit: complement[3],
			}),
		];
	}
}