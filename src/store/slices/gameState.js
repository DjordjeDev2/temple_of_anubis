import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_GAME_STATE } from "../../constants";

export const GAME_STATE_SLICE = "gameState";

const EVENT_UPDATE_BALANCE = "[Event] Update Balance";
const EVENT_STAKE_BALANCE = "[Event] Set Stake";
const EVENT_UPDATE_RESULT = "[Event] Update Result";

const gameStateSlice = createSlice({
  name: GAME_STATE_SLICE,
  initialState: INITIAL_GAME_STATE,
  reducers: {
    // Set balance.
    setBalance(state, actions) {
      console.log(EVENT_UPDATE_BALANCE);
      state.balance = actions.payload;
    },
    // Set stake.
    setStake(state, actions) {
      console.log(EVENT_STAKE_BALANCE);
      state.stake = actions.payload;
    },
    // Set placebet result.
    setResult(state, actions) {
      console.log(EVENT_UPDATE_RESULT);
      state.result = actions.payload.result;
      state.pa = actions.payload.pa;
      state.status = actions.payload.status;
      state.balance = actions.payload.balance;
      state.wa = actions.payload.wa;
      state.palen = actions.payload.palen;
    },
  },
});

export const gameStateActions = gameStateSlice.actions;

export default gameStateSlice.reducer;
