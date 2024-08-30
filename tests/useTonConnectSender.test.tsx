import { act, fireEvent, render } from "@testing-library/react"
import { Sender, toNano, TonClient, TonClientParameters } from "@ton/ton"
import { useTonConnectSender } from "../src/useTonConnectSender"
import { useTonContract } from "../src/useTonContract"
import "@testing-library/jest-dom"

jest.mock(
    "@tonconnect/ui-react",
    () => ({
        TonConnectUIProvider: ({ children }: { children: any }) => {
            return <>{children}</>
        },
        TonConnectButton: () => <></>,
        useTonAddress: jest.fn(),
        useTonConnectUI: jest.fn()
    })
)

import { TonConnectUI, TonConnectUiOptions } from "@tonconnect/ui-react"
import { Deploy, Deposit, NzComTact, Withdrawal } from "./contracts/tact_NzComTact"


describe("Testing hooks set", () => {
    const DEPOSIT_AMOUNT = 1
    const CONTRACT_ADDRESS = "EQA9dUWjN-Q_rPJv1e2SVs1WCYue0Llz9VYgty3ih14wRPF5"

    const clientSenderMock = jest.fn()
    const sendTransactionMock = jest.fn()
    const getHttpEndpointMock = jest.fn()

    const tonClientStub = {
        send: clientSenderMock,
    }

    let connectSenderExtracted: Sender
    let contractAddress: string

    const UnderTest = () => {
        const { sender } = useTonConnectSender()

        const mainContract = useTonContract(
            "mainnet",
            CONTRACT_ADDRESS,
            NzComTact
        )

        const sendDeposit = async () => {
            await mainContract?.send(
                sender!,
                {
                    value: toNano(`${DEPOSIT_AMOUNT}`),
                },
                {
                    $$type: 'Deposit'
                }
            )
        }

        return <>
            <button
                data-testid="depositButton"
                onClick={() => sendDeposit()}
            >Send</button>
        </>
    }

    beforeEach(async () => {
        jest.resetAllMocks()
        jest.spyOn(await import("@ton/ton"), "TonClient").mockImplementation(
            (_: TonClientParameters) => ({
                open: () => tonClientStub
            }) as unknown as TonClient
        )
        jest.spyOn(await import("@orbs-network/ton-access"), "getHttpEndpoint").mockImplementation(getHttpEndpointMock)

        contractAddress = CONTRACT_ADDRESS
        jest.spyOn(await import("@tonconnect/ui-react"), "useTonAddress").mockImplementation(() => contractAddress)
        jest.spyOn(await import("@tonconnect/ui-react"), "useTonConnectUI")
            .mockImplementation(() => ([
                {
                    sendTransaction: sendTransactionMock
                } as unknown as TonConnectUI,
                (_: TonConnectUiOptions) => { }
            ]))
        clientSenderMock.mockImplementation((via: Sender, _: { value: bigint }, _1: Deposit | Withdrawal | Deploy) => {
            connectSenderExtracted = via
        })
    })

    test("Should translate sending message to a transaction on connect UI", async () => {
        // GIVEN the component is rendered
        const { getByTestId } = await act(() => render(<UnderTest />))

        // AND clicking the deposit button
        await act(() => act(() => fireEvent.click(getByTestId("depositButton"))))

        // WHEN calling the extracted sender
        connectSenderExtracted.send({
            to: CONTRACT_ADDRESS,
            value: toNano(`${DEPOSIT_AMOUNT}`),
            data: { "$$type": "Deposit" }
        } as any)

        // THEN the transaction is sent via TON connect UI
        expect(sendTransactionMock).toHaveBeenCalledWith(expect.objectContaining({
            messages: [{
                address: CONTRACT_ADDRESS,
                amount: `${toNano(DEPOSIT_AMOUNT)}`
            }]
        }))
    })

    test("Should not send the message if the address is not available", async () => {
        // GIVEN the contract address is not available
        contractAddress = ""

        // AND the component is rendered
        const { getByTestId } = await act(() => render(<UnderTest />))

        // WHEN clicking the deposit button
        await act(() => act(() => fireEvent.click(getByTestId("depositButton"))))

        // THEN the contract sender is not available
        expect(connectSenderExtracted).toBeUndefined()
    })
})