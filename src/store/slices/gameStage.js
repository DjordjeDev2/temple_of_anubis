import { createSlice } from "@reduxjs/toolkit";

export const GAME_STAGE_SLICE = "gameStage";

export const STAGE_LOAD = 0;
export const STAGE_NEW_GAME = 1;
export const STAGE_PLACE_BET = 2;
export const STAGE_PLACE_BET_SUCCESS = 3;
export const STAGE_BET_RUNNING = 4;
export const STAGE_SETTLEMENT = 5;

const EVENT_LOAD = "[Event] Load stage";
const EVENT_NEW_GAME_STAGE = "[Event] New game stage";
const EVENT_PLACE_BET_STAGE = "[Event] Placebet stage";
const EVENT_PLACE_SUCCESS_STAGE = "[Event] Placebet success stage";
const EVENT_BET_RUNNING = "[Event] Bet running stage";
const EVENT_SETTLEMENT_STAGE = "[Event] Settlement stage";

const INITIAL_GAME_STAGE = { stage: STAGE_LOAD };

const gameStageSlice = createSlice({
  name: GAME_STAGE_SLICE,
  initialState: INITIAL_GAME_STAGE,
  reducers: {
    // Game loading stage.
    initializationStage(state) {
      console.log(EVENT_LOAD);
      state.stage = STAGE_LOAD;
    },
    // Game ready to play
    newGameStage(state) {
      console.log(EVENT_NEW_GAME_STAGE);
      state.stage = STAGE_NEW_GAME;
    },
    // Place bet stage.
    placeBetStage(state) {
      console.log(EVENT_PLACE_BET_STAGE);
      state.stage = STAGE_PLACE_BET;
    },
    // Place bet success.
    placeBetSuccessStage(state) {
      console.log(EVENT_PLACE_SUCCESS_STAGE);
      state.stage = STAGE_PLACE_BET_SUCCESS;
    },
    // Animations running.
    BetRunningStage(state) {
      console.log(EVENT_BET_RUNNING);
      state.stage = STAGE_BET_RUNNING;
    },
    // Settlement in progress.
    settlementStage(state) {
      console.log(EVENT_SETTLEMENT_STAGE);
      state.stage = STAGE_SETTLEMENT;
    },
  },
});

export const gameStageActions = gameStageSlice.actions;

export default gameStageSlice.reducer;
