import { formatEther } from '@ethersproject/units'

type IGame = any;

const GameItem = (props: IGame) => {
    
    return (
        <div key={props.randomNumber}>
            <div className="col-sm-4">
                <div className="form-group">
                    <div className="form-control">{props.player}</div>
                </div>
            </div>
            <div className="col-sm-1">
                <div className="form-group">
                    { props.result ? <div className="form-control">&#9989;</div> : <div className="form-control">&#10060;</div> }
                </div>
            </div>
            <div className="col-sm-1">
                <div className="form-group">
                    <div className="form-control">{props.percent}</div>
                </div>
            </div>
            <div className="col-sm-2">
                <div className="form-group">
                    <div className="form-control">{Math.trunc(Number(formatEther(props.possibleWin))) }</div>
                </div>
            </div>
            <div className="col-sm-2">
                <div className="form-group">
                    <div className="form-control">{Number(props.randomNumber)}</div>
                </div>
            </div>
        </div>
    )
}

export default GameItem;