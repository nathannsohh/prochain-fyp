import { Contract } from "ethers"
import { useMemo } from "react"
import { useMetamask } from "./useMetamask"
import ABI from "@/../../artifacts/contracts/PostFactory.sol/PostFactory.json";

const address = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

const usePostFactoryContract = () => {
    const { state } = useMetamask();
    return useMemo(
        () => state.signer && new Contract(address, ABI.abi, state.signer),
        [state.signer]
    )
}

export default usePostFactoryContract;