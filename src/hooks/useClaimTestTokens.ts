import { useEthers, Sepolia } from "@usedapp/core";
import { useCallback } from "react";
import { useContracts } from "./useContracts";
import { utils } from 'ethers';
import { toast } from "react-toastify";

export const useClaimTestTokens = () => {
  const { TokenContract } = useContracts();
  const { switchNetwork, account } = useEthers();

  return useCallback(
    async () => {
      if (!TokenContract) return;
      await switchNetwork(Sepolia.chainId);
      try {
        const claimAmount = utils.parseEther("1000000");
        const txPromise = await TokenContract.mint(account as string, claimAmount);
        const tx = await txPromise.wait();
        toast.success('Claimed!', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "colored",
        });
        return tx;
      } catch (error: any) {
        const errorMessage =
          error?.error?.message ||
          error?.message ||
          "Check console logs for error";
        console.error(error);
        console.error(errorMessage);
        toast.error('Err! See console', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: true,
            theme: "colored",
        });
      }
    },
    [TokenContract, switchNetwork, account]
  );
};