import { provider } from "../utils/provider";
import { useCallback } from "react"; 
import { Contract } from "ethers"
import TokenAbi from '../abi/Token.json';
import { formatEther } from '@ethersproject/units'
const addressToken = process.env.REACT_APP_TOKEN_CONTRACT as string;
const contractToken = new Contract(addressToken, TokenAbi, provider);

export const useGetBalance = () => {

    return useCallback(
        async (account: string) => {  
            try {
                const balance = await contractToken.balanceOf(account);
                return Number(formatEther(balance));
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
