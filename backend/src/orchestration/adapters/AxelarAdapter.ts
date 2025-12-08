import { AxelarGMPRecoveryAPI, AxelarQueryAPI, AxelarAssetTransfer, Environment, EvmChain, GasToken } from "@axelar-network/axelarjs-sdk";
import { SecureLogger } from "../../logger/SecureLogger";

export class AxelarAdapter {
    private recoveryApi: AxelarGMPRecoveryAPI;
    private queryApi: AxelarQueryAPI;
    private assetTransfer: AxelarAssetTransfer;

    constructor() {
        this.recoveryApi = new AxelarGMPRecoveryAPI({
            environment: Environment.MAINNET,
        });
        this.queryApi = new AxelarQueryAPI({
            environment: Environment.MAINNET,
        });
        this.assetTransfer = new AxelarAssetTransfer({
            environment: Environment.MAINNET,
        });
    }

    async getEstimateValues(sourceChain: string, destChain: string, amount: string = "1") {
        try {
            // Mapping common names to Axelar Chain IDs if needed, or use SDK constants
            // For now assuming strings match valid EvmChain values or close to it
            // Adjust this case sensitivity/mapping as needed for real usage
            const fee = await this.queryApi.estimateGasFee(
                sourceChain as EvmChain,
                destChain as EvmChain,
                GasToken.ETH
            );
            return fee;
        } catch (error) {
            SecureLogger.error("[Axelar] Failed to estimate gas", error);
            return "0";
        }
    }

    async getDepositAddress(sourceChain: string, destChain: string, destAddress: string, asset: string) {
        try {
            const depositAddress = await this.assetTransfer.getDepositAddress({
                fromChain: sourceChain as EvmChain,
                toChain: destChain as EvmChain,
                destinationAddress: destAddress,
                asset: asset
            });
            return depositAddress;
        } catch (error) {
            SecureLogger.error("[Axelar] Failed to get deposit address", error);
            return null;
        }
    }

    async trackStatus(txHash: string) {
        try {
            const status = await this.recoveryApi.queryTransactionStatus(txHash);
            return status;
        } catch (error) {
            SecureLogger.error("[Axelar] Failed to track status", error);
            return "unknown";
        }
    }
}
