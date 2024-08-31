# Helper hooks for TON contracts to make a bridge between TonConnect and contract wrappers

![Coverage](./badges/coverage.svg) [![npm version](https://badge.fury.io/js/use-ton-connect-sender.svg)](https://badge.fury.io/js/![use-ton-connect-sender](https://badge.fury.io/js/use-ton-connect-sender.svg)) [![Node version](https://img.shields.io/node/v/use-ton-connect-sender.svg?style=flat)](https://nodejs.org/)

## Purpose

Contains the set of React hooks:

- `useTonConnectSender`: If the component is connected to TON wallet with `TonConnectUIProvider`, returns the sender used to send messages to TON contract wrappers object together with the objects returned by `useTonConnectUI`.
- `useTonContract`: Asynchronously connects a TON contract on a given address after getting a TON client connection

There are also two utility hooks used by the hooks above:

- `useTonClient`: Asynchronously initializes the TON client on a given network
- `useAsyncInitialize`: Utility hook for asynchronous objects initialization

## Installing

```bash
npm i use-ton-connect-sender
```

## Usage

The component using the hooks contained in this package has to be wrapped inside a `TonConnectUIProvider`. The general usage schema is the following:

```ts
// ...

const ConnectedComponent = () => {
    // ...
    const mainContract = useTonContract(
        contractAddress === CONTRACT_MAINNET_ADDRESS ? "mainnet" : "testnet",
        contractAddress,
        NzComTact
    )

    const { sender, setOptions } = useTonConnectSender()
    const sendDeposit = async () => {
        if(!sender) return
        await mainContract?.send(
            sender!, 
            {
                value: toNano(`${depositAmount}`),
            },
            {
                $$type: 'Deposit'
            }
        )
    }

    useEffect(()=>{
        setOptions({ language })
    }, [language])

}

function App() {
  return <TonConnectUIProvider manifestUrl="https://www.zykov.com/manifest.json">
    <ConnectedComponent />
  </TonConnectUIProvider>
}

export default App
```

## Testing

I recommend to mock these hooks in your Jest tests. First, before the import of the tested module, prepare them for setting `spyOn`:

```ts
const makeImportsSpyable = (toCheck: { path: string, componentsToMock?: string[] }[]) =>
toCheck.forEach(({ path, componentsToMock: propsToMock }) => jest.mock(path, () => ({
    __esModule: true,
    ...jest.requireActual(path),
    ...propsToMock?.reduce((acc: any, curr) => {
        acc[curr] = jest.fn()
        return acc
    }, {})
})))

makeImportsSpyable([
    { path: "use-ton-connect-sender" },
])
```

Then, in the `beforeEach` section, override them by your test objects:

```ts
jest.spyOn(await import("use-ton-connect-sender"), "useTonConnectSender")
    .mockImplementation(() => ({
        sender: senderAvailable ? senderStub : undefined,
        tonConnectUI: jest.fn() as any,
        setOptions: setOptionsMock
    }))
useTonContractMock = jest.spyOn(await import("use-ton-connect-sender"), "useTonContract")
    .mockReturnValue(tonContractStub) as any
```

For an example of a fully tested project using these hooks, refer to [this article](https://medium.com/stackademic/ton-contracts-made-easier-an-example-in-tact-language-5a4dd812ecfd?sk=51a74ca49c99b0126fd8ae7ed4d37dd5) 