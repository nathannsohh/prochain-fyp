import { Contract } from "ethers"
import { useMemo } from "react"
import { useMetamask } from "./useMetamask"
import ABI from "@/../../artifacts/contracts/JobExperienceFactory.sol/JobExperienceFactory.json";

const address = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

const useJobExperienceFactoryContract = () => {
    const { state } = useMetamask();
    return useMemo(
        () => state.signer && new Contract(address, ABI.abi, state.signer),
        [state.signer]
    )
}

export default useJobExperienceFactoryContract;