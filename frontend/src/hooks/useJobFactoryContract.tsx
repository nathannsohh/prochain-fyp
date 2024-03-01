import { Contract } from "ethers"
import { useMemo } from "react"
import { useMetamask } from "./useMetamask"
import ABI from "@/../../artifacts/contracts/JobFactory.sol/JobFactory.json";

const address = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

const useJobFactoryContract = () => {
    const { state } = useMetamask();
    return useMemo(
        () => state.signer && new Contract(address, ABI.abi, state.signer),
        [state.signer]
    )
}

export default useJobFactoryContract;