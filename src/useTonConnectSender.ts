import { Address, Sender, SenderArguments } from "@ton/core"
import { TonConnectUI, TonConnectUiOptions, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"

/**
 * Information about TON sender wrapper
 */
export type SenderInfo = {
    /**
     * Sender object to be used to translate `send` call on a TON contract wrapper to a wallet's `sendTransaction` call
     */
    sender: Sender | undefined,
    /**
     * `TonConnectUI`, as returned by `useTonConnectUI`
     */
    tonConnectUI: TonConnectUI,
    /**
     * Lets you set options for `useTonConnectUI`, for example the interface language
     * @param options Configuration ptions to be passed to `useTonConnectUI`
     */
    setOptions: (options: TonConnectUiOptions) => void
}

/**
 * If the component is connected to TON wallet with `TonConnectUIProvider`, returns the sender used to send messages to TON contract wrappers object together with the objects returned by `useTonConnectUI`.
 * If the component is not connected, the sender object will be undefined
 * @returns Sender information {@link SenderInfo}
 */
export const useTonConnectSender = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI()
    const myAddressString = useTonAddress(false)
    if (!myAddressString) return { sender: undefined, tonConnectUI, setOptions }
    const myAddress = Address.parse(myAddressString)
    const MS_IN_SEC = 1_000
    const TX_VALIDITY_SECS = 600
    return {
        sender: {
            address: myAddress,
            send: async (args: SenderArguments) => {
                await tonConnectUI.sendTransaction({
                    validUntil: Math.floor(Date.now() / MS_IN_SEC) + TX_VALIDITY_SECS,
                    messages: [{
                        address: args.to.toString(),
                        amount: args.value.toString(),
                        payload: args.body?.toBoc().toString("base64")
                    }]
                })
            }
        },
        tonConnectUI, setOptions
    } as SenderInfo
}