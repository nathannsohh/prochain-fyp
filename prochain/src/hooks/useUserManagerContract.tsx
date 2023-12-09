import { Contract } from "ethers"
import { useMemo } from "react"
import { useMetamask } from "./useMetamask"
import ABI from "@/../../artifacts/contracts/UserManager.sol/UserManager.json";

const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const useUserManangerContract = () => {
    const { state } = useMetamask();
    return useMemo(
        () => state.signer && new Contract(address, ABI.abi, state.signer),
        [state.signer]
    )
}

export default useUserManangerContract;