"use client"
import { useMetamask } from "./useMetamask";

export const useListen = () => {
  const { dispatch, state: { provider, signer } } = useMetamask();

  return () => {
    window.ethereum.on("accountsChanged", async (newAccounts: string[]) => {
      if (newAccounts.length > 0 && provider !== null) {
        // upon receiving a new wallet, we'll request again the balance to synchronize the UI.
        const newBalance = await window.ethereum!.request({
          method: "eth_getBalance",
          params: [newAccounts[0], "latest"],
        });

        dispatch({
          type: "connect",
          wallet: newAccounts[0],
          balance: newBalance,
          provider: provider!,
          signer: await provider!.getSigner()
        });
      } else {
        // if the length is 0, then the user has disconnected from the wallet UI
        dispatch({ type: "disconnect" });
      }
    });
  };
};