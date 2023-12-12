import { Contract } from "ethers"
import { useMemo } from "react"
import { useMetamask } from "./useMetamask"
import ABI from "@/../../artifacts/contracts/UserManager.sol/UserManager.json";

const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const useUserManangerContract = () => {
    const { state } = useMetamask();
    return useMemo(
        () => state.signer && new Contract(address, ABI.abi, state.signer),
        [state.signer]
    )
}

export default useUserManangerContract;