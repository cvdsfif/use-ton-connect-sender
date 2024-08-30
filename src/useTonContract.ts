import { Network } from "@orbs-network/ton-access";
import { Address, Contract, OpenedContract } from "@ton/core";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useRef } from "react";

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
        const address = Address.parse(unparsedAddress)
        const openedContract = client.open(factory.fromAddress(address)) as OpenedContract<T>
        return openedContract
    }, [client])
    return contract
}