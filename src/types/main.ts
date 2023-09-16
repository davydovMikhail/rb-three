export interface MainState {
    loader: boolean;
    notification: string;
    showOK: boolean;
    games: any[];
}

export enum MainActionTypes {
    SET_LOADER = 'SET_LOADER',
    SET_NOTIFICATION = 'SET_NOTIFICATION',
    SET_SHOW_OK = 'SET_SHOW_OK',
    PUSH_GAME = 'PUSH_GAME',
    CLEAR_GAMES = 'CLEAR_GAMES'
} 
interface SetLoaderAction {
    type: MainActionTypes.SET_LOADER;
    payload: boolean;
}
interface SetNotificationAction {
    type: MainActionTypes.SET_NOTIFICATION;
    payload: string;
}
interface SetShowOkAction {
    type: MainActionTypes.SET_SHOW_OK;
    payload: boolean;
}
interface PushGameAction {
    type: MainActionTypes.PUSH_GAME;
    payload: any;
}
interface ClearGamesAction {
    type: MainActionTypes.CLEAR_GAMES;
}

export type MainAction = 
    SetLoaderAction |
    SetNotificationAction |
    SetShowOkAction |
    PushGameAction |
    ClearGamesAction;
    