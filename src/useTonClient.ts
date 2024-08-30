import { getHttpEndpoint, Network } from '@orbs-network/ton-access'
import { useAsyncInitialize } from './useAsyncInitialize'
import { TonClient } from '@ton/ton'

export const useTonClient = (network: Network) => {
    return useAsyncInitialize(
        async () =>
            new TonClient({
                endpoint: await getHttpEndpoint({ network }),
            }), [network]
    )
}