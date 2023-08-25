import {WalletProviderInterface} from "@whal3s/whal3s.js";
import {Network} from "@whal3s/whal3s.js/build/types/types";
import { WalletInstance } from '@thirdweb-dev/react'

class ThirdwebProvider extends EventTarget implements WalletProviderInterface {

    public walletInstance: WalletInstance;
    public _address: string | undefined;

    constructor(walletInstance: WalletInstance) {
        super()
        this.walletInstance = walletInstance;
        this._initializeAccount()

    }

    _initializeAccount() {

        this.walletInstance.on("change", (data) => {
            if (data.address !== this._address) {
                this.dispatchEvent(new Event("addressChanged"))
                this._address = data.address
            }
        })
        this.walletInstance.on("connect", (data) => {
            if (data.address !== this._address) {
                this.dispatchEvent(new Event("addressChanged"))
                this._address = data.address
            }
        })
        this.walletInstance.on("disconnect", () => {
            this.dispatchEvent(new Event("disconnected"))
            this._address = undefined
        })
    }

    setWalletInstance(walletInstance: WalletInstance) {
        this.walletInstance = walletInstance;
        this._initializeAccount()

    }

    get address(): string | undefined {
        return this._address;
    }


    async getAddress(): Promise<string | undefined> {
        return this.walletInstance.getAddress()
    }

    connect(network: Network): Promise<boolean> {
        return this.walletInstance.connect({
            chainId: network.id
        }) as any as Promise<boolean>
    }

    async onSameNetwork(network: Network): Promise<boolean> {
        if (!this.walletInstance?.getChainId()) {
            throw("No wallet instance available")
        }
        const currentChainId = await this.walletInstance?.getChainId()
        return Promise.resolve(currentChainId === network.id)
    }

    async signMessage(message: string): Promise<string> {

        if (!this.walletInstance?.getChainId()) {
            throw("No wallet instance available")
        }

        return this.walletInstance.signMessage(message)
    }


    async switchNetwork(network: Network): Promise<boolean> {
        if (!this.walletInstance)
            return Promise.resolve(false)
        await this.walletInstance.switchChain(network.id)

        const switchedChain = await this.walletInstance.getChainId()
        return Promise.resolve(switchedChain === network.id)
    }

}

export default ThirdwebProvider
