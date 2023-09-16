import { provider } from "../utils/provider";
import { useCallback } from "react"; 
import { Contract } from "ethers"
import GameAbi from '../abi/Game.json';
import { formatEther } from '@ethersproject/units';
const addressGame = process.env.REACT_APP_GAME_CONTRACT as string;
const contractGame = new Contract(addressGame, GameAbi, provider);

export const useGetMaxWin = () => {
    return useCallback(
        async () => {  
            try {
                const maxBid = await contractGame.getMaxBidAmount();
                return Number(formatEther(maxBid));
            } catch(error: any) {
                const errorMessage =
                    error?.error?.message ||
                    error?.message ||
                    "Check console logs for error";
                console.error(error);
                console.error(errorMessage);
            } 
        }
        ,[]
    );
}