import { useState, useEffect, useRef } from 'react'
import { useEthers } from "@usedapp/core";
import { useGetBalance } from '../hooks/useGetBalance';
import { useClaimTestTokens } from '../hooks/useClaimTestTokens';
import { useGetAllowance } from '../hooks/useGetAllowance';
import { toast } from "react-toastify";
import { useActions } from '../hooks/useActions';
import { useApproveToGame } from '../hooks/useApproveToGame';
import { usePlayBid } from '../hooks/usePlayBid';
import { useRequestGameHash } from '../hooks/useRequestGameHash';
import { useGetRandomNumber } from '../hooks/useGetRandomNumber';
import { useGetLastHash } from '../hooks/useGetLastHash';
import { useGetCurrentBlockNumber } from '../hooks/useGetBlockNumber';
import { useGetMaxWin } from '../hooks/useGetMaxWin';
import { useGetHashes } from '../hooks/useGetHashes';
import { useGetGame } from '../hooks/useGetGame';
import { useTypedSelector } from '../hooks/useTypedSelector';
import SetInterval from 'set-interval'
import GameItem from '../components/game-item/gameItem';
import { get } from 'http';

const Main = () => {
    const { activateBrowserWallet, account } = useEthers();
    const { SetNotification, SetLoader, SetShowOk, 
        // PushGame, ClearGames
     } = useActions();
    const {games} = useTypedSelector(state => state.main);

    const start: any = useRef();

    const [amount, setAmount] = useState('1');
    const [percent, setPercent] = useState('5');
    const [balance, setBalance] = useState(0);
    const [maxWin, setMaxWin] = useState(0);

    const [point, setPoint] = useState('500'); 


    const firstIteration = useRef(true);
    const getBalanceHook = useGetBalance();
    const claimHook = useClaimTestTokens();
    const allowanceHook = useGetAllowance();
    const approveHook = useApproveToGame();
    const requestHook = useRequestGameHash();
    const randomHook = useGetRandomNumber();
    const playHook = usePlayBid();
    const hashHook = useGetLastHash();
    const blockHook = useGetCurrentBlockNumber();
    const maxWinHook = useGetMaxWin();
    const hashesHook = useGetHashes();
    const gameHook = useGetGame();

    useEffect(() => {
        const fetchData = async () => {
            const balanceAccount = await getBalanceHook(account as string);   
            setBalance(balanceAccount as number);
        }
        fetchData().catch(console.error);
    }, [account]);

    useEffect(() => {
        const fetchData = async () => {
            const maxWin = await maxWinHook(); 
            setMaxWin(maxWin as number);
            // await updateLastGames();
        }
        fetchData().catch(console.error);
    },[]);

    // async function updateLastGames() {
    //     const hashes = await hashesHook() as any[];
    //     for(let i = 0; i < hashes.length; i++) {
    //         const game = await gameHook(hashes[i]);
    //         PushGame(game);
    //     }
    // }

    async function handlePlay(isGreater: boolean) {
        if (!account) {
            toast.info('First connect your wallet', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            return;
        }
        // if (maxWin < (getPossibleWin() as number)) {
        //     toast.info('Possible win exceed the max win', {
        //         position: "top-center",
        //         autoClose: 1000,
        //         hideProgressBar: true,
        //         pauseOnHover: false,
        //         draggable: true,
        //         theme: "colored",
        //     });
        //     return;
        // }
        firstIteration.current = true;
        SetLoader(true);
        if((await allowanceHook(account) as number) < Number(amount)) {
            SetNotification('Approve your game tokens to the address of the game contract');
            await approveHook();
        }
        SetNotification('Requesting the hash of your game...');
        const hashBefore = await hashHook(account);
        const balanceBefore = (await getBalanceHook(account as string)) as number;
        const targetBlock = (await requestHook(amount, percent, isGreater))?.blockNumber.toString() as string;
        SetNotification('Confirm the call to the play function');
        SetInterval.start(async () => {
            const currentBlock = (await blockHook()) as number;
            const hashAfter = await hashHook(account);
            if(hashBefore !== hashAfter && currentBlock > Number(targetBlock) && firstIteration.current) {
                firstIteration.current = false;
                SetInterval.clear('checkHash')
                clearInterval(start.current);
                await playHook();
                const randomNumber = await randomHook(targetBlock, account);
                const balanceAfter = (await getBalanceHook(account as string)) as number;
                if(balanceAfter > balanceBefore) {
                    SetNotification(`You've won! The block number - ${targetBlock}. Random number - ${randomNumber}`);
                } else {
                    SetNotification(`Your bet is not played! The block number - ${targetBlock}. Random number - ${randomNumber}`);
                }
                SetShowOk(true);     
                setBalance(balanceAfter);
                const maxWin = await maxWinHook(); 
                setMaxWin(maxWin as number);
                // ClearGames();
                // await updateLastGames();
            }
        }, 500, "checkHash")
    }
    async function handleClaim() {
        if (!account) {
            toast.info('First connect your wallet', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            return;
        }
        SetLoader(true);
        await claimHook();
        SetLoader(false);
        const balanceAccount = await getBalanceHook(account as string);               
        setBalance(balanceAccount as number);
    }
    function handleValidateAmount(_amount: string) {
        if (Number(_amount) < 1) {
            setAmount("1");
        } else if (Number(_amount) > balance) {
            setAmount(balance.toString());
        } else {
            setAmount(_amount);  
        }
    }
    function handleDoubleAmount() {
        const doubleAmount = Number(amount) * 2;
        if(doubleAmount > balance) {
            setAmount(balance.toString());
        } else {
            setAmount(doubleAmount.toString());
        }
    }
    function handleMaxAmount() {
        setAmount(balance.toString());
    }
    function handleHalfAmount() {
        const halfAmount = Number(amount) / 2;
        if(halfAmount < 1) {
            setAmount("1");
        } else {
            setAmount(halfAmount.toString());
        }
    }
    function handleMinAmount() {
        setAmount("1");
    }


    function handleValidatePoint(_point: string) {
        if (Number(_point) < 50) {
            setPoint("50");
        } else if (Number(_point) > 950) {
            setPoint("950");
        } else {
            setPoint(_point);
        }
    }

    function changePoint(_diff: number) {
        const newPoint = Number(point) + _diff;
        handleValidatePoint(newPoint.toString());
    }

    function getRange() {
        if(Number(point) < 50 || Number(point) > 950) {
          return NaN
        }
        return Number(point);
    }
    function getPercent() {
        if(Number(point) < 50 || Number(point) > 950) {
            return NaN
        }
        return Number(point) / 10;
    }
    function getLeftWin() {
        if(Number(point) < 50 || Number(point) > 950 || Number(amount) < 1) {
          return NaN
        }
        const answer = (Number(amount) * 100) / getPercent(); 
        return answer.toFixed(2);
    }
    function getRightWin() {
        if(Number(point) < 50 || Number(point) > 950 || Number(amount) < 1) {
          return NaN
        }
        const answer = (Number(amount) * 100) / (100 - getPercent()); 
        return answer.toFixed(2);
    }

    function getWidth() {
        if (!getPercent()) {
            return 50;
        }
        return getPercent();
    }

    return (
        <>
            <div className="nude">
                <div className="wrapper">
                    <div className="main">
                        <div className="section section-white">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="space-top"></div>
                                        <div className="tim-container">
                                        <div className="tim-row" id="edit-metric-labels">
                                            <h2>Max possible win: {maxWin} </h2>
                                            <legend></legend>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Bid amount</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <input 
                                                            type="number"
                                                            placeholder="Amount" 
                                                            className="form-control border-input"
                                                            value={amount || ''}
                                                            onChange={(e) => setAmount(e.target.value)}
                                                            onBlur={(e) => handleValidateAmount(e.target.value)} 
                                                        />
                                                    </div>
                                                    <div className="small-btns">
                                                        <button onClick={() => handleDoubleAmount()} className="btn btn-primary btn-xs small-btn">double</button>
                                                        <button onClick={() => handleMaxAmount()} className="btn btn-primary btn-xs small-btn">max</button>
                                                        <button onClick={() => handleHalfAmount()} className="btn btn-primary btn-xs small-btn">half</button>
                                                        <button onClick={() => handleMinAmount()} className="btn btn-primary btn-xs small-btn">min</button>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Split Point</label>
                                                    </div>
                                                    <div className="form-group">
                                                        <input 
                                                            type="number" 
                                                            placeholder="Split" 
                                                            className="form-control border-input"
                                                            value={point || ''}
                                                            onChange={(e) => setPoint(e.target.value)}  
                                                            onBlur={(e) => handleValidatePoint(e.target.value)}  
                                                        />
                                                    </div>
                                                    <div className="small-btns">
                                                        <button onClick={() => changePoint(25)} className="btn btn-primary btn-xs small-btn">+25</button>
                                                        <button onClick={() => changePoint(200)} className="btn btn-primary btn-xs small-btn">+200</button>
                                                        <button onClick={() => changePoint(-25)} className="btn btn-primary btn-xs small-btn">-25</button>
                                                        <button onClick={() => changePoint(-200)} className="btn btn-primary btn-xs small-btn">-200</button>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="choose">
                                                        <div className="choose__var">
                                                            <div className="info__win__title">Possible win</div>
                                                            <div className="info__win">
                                                                {getLeftWin()}
                                                            </div>
                                                            <div className="choose__diaposon">0-{ getRange() - 1 }</div> 
                                                            <div className="choose__diaposon">{getPercent()} %</div> 
                                                            <button onClick={() => handlePlay(false)} className="btn btn-warning btn-lg choose__btn">LEFT</button>
                                                        </div>
                                                        <div className="choose__var">
                                                            <div className="info__win__title">Possible win</div>
                                                            <div className="info__win">
                                                                {getRightWin()}
                                                            </div>
                                                            <div className="choose__diaposon">{ getRange() }-999</div> 
                                                            <div className="choose__diaposon">{100 - getPercent()} %</div> 
                                                            <button onClick={() => handlePlay(true)} className="btn btn-warning btn-lg choose__btn">RIGHT</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row" style={{display: "flex", marginTop: "20px"}}>
                                                <div className="blue" style={{ width: `${getWidth()}%` }}></div>
                                                <div className="green" style={{ width: `${100 - getWidth()}%` }} ></div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <button onClick={() => activateBrowserWallet()} type="button" className="btn btn-warning btn-lg">Connect Wallet</button>
                                    </div>
                                    <div className="col-md-2">
                                        <button onClick={() => handleClaim()} type="button" className="btn btn-warning btn-lg">Claim Test Tokens</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 h5" >
                                        {account ? `WALLET: ${account}`: "Click 'Connect Wallet'"}
                                    </div>
                                </div>
                                {account && 
                                    <div className="row">
                                        <div className="col-md-8 h5" >
                                            BALANCE: {balance} TGT
                                        </div>
                                    </div>
                                }
                                {/* <div className="row">
                                    <div className="col-md-8 h5" >
                                        Address token: 0x12a804d83957Dd32E7f8bC997681E7Ecd4920949 
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8 h5" >
                                        Address game: 0xeBc187C7Ba3BCeDE5e6C7470A8CA6977A5B29032 
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8 h5" >
                                        Commissioner: 0x7770000000000000000000000000000000000777
                                    </div>
                                </div> */}
                                <div className="row">
                                    <div className="col-md-12">
                                        <h2>Last Results</h2>
                                    </div>
                                    <div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Address</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-1">
                                            <div className="form-group">
                                                <label>Won</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-1">
                                            <div className="form-group">
                                                <label>Chance(%)</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-2">
                                            <div className="form-group">
                                                <label>Win Sum</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-2">
                                            <div className="form-group">
                                                <label>Random Number</label>
                                            </div>
                                        </div>
                                    </div>
                                    {games.map(block => GameItem(block))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
        
    )
}

export default Main;