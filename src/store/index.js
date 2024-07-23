import { configureStore, combineReducers } from "@reduxjs/toolkit";
import gameStageSlice from "./slices/gameStage";
import gameStateSlice from "./slices/gameState";

// Merge reducers.
const rootReducer = combineReducers({
  gameStage: gameStageSlice,
  gameState: gameStateSlice,
});

// Create store.
const store = configureStore({
  reducer: rootReducer,
});

export default store;
