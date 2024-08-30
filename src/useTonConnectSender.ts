import { Address, SenderArguments } from "@ton/core"
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react"

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
    }
}