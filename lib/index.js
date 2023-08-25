'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class ThirdwebProvider extends EventTarget {
    constructor(walletInstance) {
        super();
        this.walletInstance = walletInstance;
        this._initializeAccount();
    }
    _initializeAccount() {
        this.walletInstance.on("change", (data) => {
            if (data.address !== this._address) {
                this.dispatchEvent(new Event("addressChanged"));
                this._address = data.address;
            }
        });
        this.walletInstance.on("connect", (data) => {
            if (data.address !== this._address) {
                this.dispatchEvent(new Event("addressChanged"));
                this._address = data.address;
            }
        });
        this.walletInstance.on("disconnect", () => {
            this.dispatchEvent(new Event("disconnected"));
            this._address = undefined;
        });
    }
    setWalletInstance(walletInstance) {
        this.walletInstance = walletInstance;
        this._initializeAccount();
    }
    get address() {
        return this._address;
    }
    getAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.walletInstance.getAddress();
        });
    }
    connect(network) {
        return this.walletInstance.connect({
            chainId: network.id
        });
    }
    onSameNetwork(network) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = this.walletInstance) === null || _a === void 0 ? void 0 : _a.getChainId())) {
                throw ("No wallet instance available");
            }
            const currentChainId = yield ((_b = this.walletInstance) === null || _b === void 0 ? void 0 : _b.getChainId());
            return Promise.resolve(currentChainId === network.id);
        });
    }
    signMessage(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = this.walletInstance) === null || _a === void 0 ? void 0 : _a.getChainId())) {
                throw ("No wallet instance available");
            }
            return this.walletInstance.signMessage(message);
        });
    }
    switchNetwork(network) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.walletInstance)
                return Promise.resolve(false);
            yield this.walletInstance.switchChain(network.id);
            const switchedChain = yield this.walletInstance.getChainId();
            return Promise.resolve(switchedChain === network.id);
        });
    }
}

exports.ThirdwebProvider = ThirdwebProvider;
//# sourceMappingURL=index.js.map
