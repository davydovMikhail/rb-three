import { MainAction, MainActionTypes } from "../../types/main";

export function SetLoader(loader: boolean): MainAction {
    return {type: MainActionTypes.SET_LOADER, payload: loader}
}
export function SetNotification(notification: string): MainAction {
    return {type: MainActionTypes.SET_NOTIFICATION, payload: notification}
}
export function SetShowOk(showOk: boolean): MainAction {
    return {type: MainActionTypes.SET_SHOW_OK, payload: showOk}
}
export function PushGame(game: any): MainAction {
    return {type: MainActionTypes.PUSH_GAME, payload: game}
}
export function ClearGames(): MainAction {
    return {type: MainActionTypes.CLEAR_GAMES}
}