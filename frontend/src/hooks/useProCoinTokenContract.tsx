import { Contract } from "ethers"
import { useMemo } from "react"
import { useMetamask } from "./useMetamask"
import ABI from "@/../../artifacts/contracts/ProCoinToken.sol/ProCoinToken.json";

const address = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const useProCoinTokenContract = () => {
    const { state } = useMetamask();
    return useMemo(
        () => state.signer && new Contract(address, ABI.abi, state.signer),
        [state.signer]
    )
}

export default useProCoinTokenContract;