import { MainState, MainAction, MainActionTypes } from "../../types/main"
// import {  } from "@usedapp/core";

const initialState: MainState = {
    loader: false,
    notification: "",
    showOK: false,
    games: [],
}

export const mainReducer = (state: MainState = initialState, action: MainAction): MainState => {
    switch (action.type) {
        case MainActionTypes.SET_LOADER:
            return {...state, loader: action.payload}
        case MainActionTypes.SET_NOTIFICATION:
            return {...state, notification: action.payload}
        case MainActionTypes.SET_SHOW_OK:
            return {...state, showOK: action.payload}
        case MainActionTypes.PUSH_GAME:
            return {...state, games: [...state.games, action.payload] }
        case MainActionTypes.CLEAR_GAMES:
            return {...state, games: [] }
        default:
            return state
    }
}