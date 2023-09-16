import { provider } from "../utils/provider";
import { useCallback } from "react"; 
import { Contract } from "ethers"
import GameAbi from '../abi/Game.json';
const addressGame = process.env.REACT_APP_GAME_CONTRACT as string;
const contractGame = new Contract(addressGame, GameAbi, provider);

export const useGetHashes = () => {
    return useCallback(
        async () => {  
            try {
                let end = (await contractGame.getLengthAllHashes()).toNumber();
                let start = 0;
                if (end > 10) {
                    start = end - 10;
                } else {
                    start = 0;
                }
                const hashes: string[] = (await contractGame.getSliceAllHashes(start, end));
                const arr = new Array(...hashes);
                arr.reverse();
                return arr;
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