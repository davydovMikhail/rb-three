import { provider } from "../utils/provider";
import { useCallback } from "react"; 
import { Contract } from "ethers"
import GameAbi from '../abi/Game.json';
const addressGame = process.env.REACT_APP_GAME_CONTRACT as string;
const contractGame = new Contract(addressGame, GameAbi, provider);

export const useGetLastHash = () => {

    return useCallback(
        async (account: string) => {  
            try {
                const hash = await contractGame.lastHashes(account);
                return hash;
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