import { Network } from "@orbs-network/ton-access";
import { Address, Contract, OpenedContract } from "@ton/core";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";

type ContractFactory<T extends Contract> = {
    fromAddress: (address: Address) => T
}

export const useTonContract = <T extends Contract>(
    network: Network,
    unparsedAddress: string,
    factory: ContractFactory<T>
) => {
    const client = useTonClient(network)
    const contract = useAsyncInitialize(async () => {
        if (!client) return
        console.log(`Parsing address: {${unparsedAddress}}`)
        const address = Address.parse(unparsedAddress.toString())
        console.log(`Address parsed: {${address.toString()}}`)
        const factoryClient = factory.fromAddress(address)
        console.log(`Factory client`, factoryClient)
        const openedContract = client.open(factoryClient) as OpenedContract<T>
        console.log(`Contract opened`, openedContract)
        return openedContract
    }, [client])
    return contract
}