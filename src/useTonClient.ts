import { getHttpEndpoint, Network } from '@orbs-network/ton-access'
import { useAsyncInitialize } from './useAsyncInitialize'
import { TonClient } from '@ton/ton'

/**
 * Asynchronously initializes the TON client on a given network
 * @param network `mainnet` or `testnet`
 * @returns Ton client, when available
 */
export const useTonClient = (network: Network) => {
    return useAsyncInitialize(
        async () =>
            new TonClient({
                endpoint: await getHttpEndpoint({ network }),
            }), [network]
    )
}