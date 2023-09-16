import { useEthers, Sepolia } from "@usedapp/core";
import { useCallback } from "react";
import { useContracts } from "./useContracts";
import { constants } from 'ethers';
import { toast } from "react-toastify";
const addressGame = process.env.REACT_APP_GAME_CONTRACT as string;

export const useApproveToGame = () => {
  const { TokenContract } = useContracts();
  const { switchNetwork, account } = useEthers();

  return useCallback(
    async () => {
      if (!TokenContract) return;
      await switchNetwork(Sepolia.chainId);
      try {
        const txPromise = await TokenContract.approve(addressGame, constants.MaxUint256);
        const tx = await txPromise.wait();
        toast.success('Approved!', {
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