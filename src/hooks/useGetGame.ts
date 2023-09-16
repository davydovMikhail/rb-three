import { provider } from "../utils/provider";
import { useCallback } from "react"; 
import { Contract } from "ethers"
import GameAbi from '../abi/Game.json';
const addressGame = process.env.REACT_APP_GAME_CONTRACT as string;
const contractGame = new Contract(addressGame, GameAbi, provider);

export const useGetGame = () => {

    return useCallback(
        async (hash: string) => {  
            try {
                const game = await contractGame.allGames(hash);
                return game;
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