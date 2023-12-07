import Link from "next/link";
import { useMetamask } from "../hooks/useMetamask";
import { Button, Text } from "@chakra-ui/react"
import { useListen } from "@/hooks/useListen";
import { useRouter } from "next/navigation";


export default function Wallet() {
    const {
        dispatch,
        state: { status, isMetamaskInstalled, wallet, balance },
    } = useMetamask();
    const listen = useListen();
    const router = useRouter();

    const showInstallMetamask = status !== "pageNotLoaded" && !isMetamaskInstalled;
    const showConnectButton = status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

    const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

    const handleConnect = async () => {
        dispatch({ type: "loading" });
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
            const balance = await window.ethereum!.request({
                method: "eth_getBalance",
                params: [accounts[0], "latest"],
            });
            dispatch({ type: "connect", wallet: accounts[0], balance });

            // we can register an event listener for changes to the users wallet
            listen();
            router.back()
        }
    }

    const handleDisconnect = () => {
        dispatch({ type: "disconnect" });
      };

    const handleAddUsdc = async () => {
        dispatch({ type: "loading" });
    
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              symbol: "USDC",
              decimals: 18,
              image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023",
            },
          },
        });
        dispatch({ type: "idle" });
      };

    return (
        <>
            {showConnectButton && (
                <Button onClick={handleConnect}>
                    {status === "loading" ? "Loading" : "Connect Wallet"}
                </Button>
            )}

            {showInstallMetamask && (
                <Link href="https://metamask.io/" target="_blank" legacyBehavior>
                <a className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto">
                  Install Metamask
                </a>
              </Link>
            )}

           { wallet && balance && <Text>Balance: {  (parseInt(balance) / 1000000000000000000).toFixed(4)} ETH</Text>}

           {isConnected && (
            <>
                <Button
                    onClick={handleAddUsdc}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache text-white px-5 py-3 text-base font-medium  sm:w-auto"
                >
                    {status === "loading" ? "Loading": "Add Token"}
                </Button>
                <Button onClick={handleDisconnect}>
                    Disconnect
                </Button>
          </>
        )}
        </>
    )
};



