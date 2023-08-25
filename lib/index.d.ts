import { WalletProviderInterface } from '@whal3s/whal3s.js';
import { Network } from '@whal3s/whal3s.js/build/types/types';
import { WalletInstance } from '@thirdweb-dev/react';

declare class ThirdwebProvider extends EventTarget implements WalletProviderInterface {
    walletInstance: WalletInstance;
    _address: string | undefined;
    constructor(walletInstance: WalletInstance);
    _initializeAccount(): void;
    setWalletInstance(walletInstance: WalletInstance): void;
    get address(): string | undefined;
    getAddress(): Promise<string | undefined>;
    connect(network: Network): Promise<boolean>;
    onSameNetwork(network: Network): Promise<boolean>;
    signMessage(message: string): Promise<string>;
    switchNetwork(network: Network): Promise<boolean>;
}

export { ThirdwebProvider };
