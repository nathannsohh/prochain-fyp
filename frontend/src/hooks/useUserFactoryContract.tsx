import { Contract } from "ethers"
import { useMemo } from "react"
import { useMetamask } from "./useMetamask"
import ABI from "@/../../artifacts/contracts/UserFactory.sol/UserFactory.json";

const address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const useUserFactoryContract = () => {
    const { state } = useMetamask();
    return useMemo(
        () => state.signer && new Contract(address, ABI.abi, state.signer),
        [state.signer]
    )
}

export default useUserFactoryContract;