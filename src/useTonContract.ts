import { Network } from "@orbs-network/ton-access";
import { Address, Contract, OpenedContract } from "@ton/core";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";

/**
 * Minimal definition of an object returning a TON contract wrapper
 */
export type ContractFactory<T extends Contract> = {
    fromAddress: (address: Address) => T
}

/**
 * Asynchronously connects a TON contract on a given address after getting a TON client connection
 * @param network `testnet` or `mainnet`
 * @param unparsedAddress String representation of a TON contract's address
 * @param factory Usually, the wrapper's constructor object
 * @returns Opened version of the TON contract
 */
export const useTonContract = <T extends Contract>(
    network: Network,
    unparsedAddress: string,
    factory: ContractFactory<T>
) => {
    const client = useTonClient(network)
    const contract = useAsyncInitialize(async () => {
        if (!client) return
        const address = Address.parse(unparsedAddress.toString())
        const factoryClient = factory.fromAddress(address)
        const openedContract = client.open(factoryClient) as OpenedContract<T>
        return openedContract
    }, [client])
    return contract
}