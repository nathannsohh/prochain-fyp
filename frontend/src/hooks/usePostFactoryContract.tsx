import { Contract } from "ethers"
import { useMemo } from "react"
import { useMetamask } from "./useMetamask"
import ABI from "@/../../artifacts/contracts/PostFactory.sol/PostFactory.json";

const address = "xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const usePostFactoryContract = () => {
    const { state } = useMetamask();
    return useMemo(
        () => state.signer && new Contract(address, ABI.abi, state.signer),
        [state.signer]
    )
}

export default usePostFactoryContract;