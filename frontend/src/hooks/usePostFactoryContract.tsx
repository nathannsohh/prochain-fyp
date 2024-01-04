import { Contract } from "ethers"
import { useMemo } from "react"
import { useMetamask } from "./useMetamask"
import ABI from "@/../../artifacts/contracts/PostFactory.sol/PostFactory.json";

const address = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

const usePostFactoryContract = () => {
    const { state } = useMetamask();
    return useMemo(
        () => state.signer && new Contract(address, ABI.abi, state.signer),
        [state.signer]
    )
}

export default usePostFactoryContract;