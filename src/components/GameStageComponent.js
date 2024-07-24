import * as PIXI from "pixi.js";
import { Sprite } from "react-pixi-fiber/index.js";
import ReelHolderComponent from "./reels/ReelHolderComponent";
import { Stage } from "react-pixi-fiber/index.js";
import SpriteButtonComponent from "./controls/SpriteButtonComponent";
import PanelComponent from "./controls/PanelComponent";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import store from "../store";
import SoundUtils from "../utils/SoundUtils";
import { gameStateActions } from "../store/slices/gameState";
import bankManagerInstance from "../bank/BankManager";
import { valueReturnTween, valueTween } from "../utils/TweenUtil";
import {
  gameStageActions,
  STAGE_LOAD,
  STAGE_NEW_GAME,
  STAGE_PLACE_BET_SUCCESS,
  STAGE_SETTLEMENT,
} from "../store/slices/gameStage";
import * as Constants from "../constants";
import { STAGE_PLACE_BET } from "../store/slices/gameStage";
import StepperComponent from "./controls/StepperComponent";
import LabelComponent from "./controls/LabelComponent";
import StageStyle from "./GameStageComponent.module.css";

function GameStageComponent() {
  // Get game stage.
  const gameStage = useSelector((state) => state.gameStage.stage);
  // Get game state.
  const gameState = useSelector((state) => state.gameState);

  // Get user label balance.
  const [labelBalance, setLabelBalance] = useState(
    Constants.INITIAL_GAME_STATE.balance
  );

  // Win screen scale state used for animation.
  const [winScreenScale, setWinScreenScale] = useState(0.0);

  const [winScreenLabel, setWinScreenLabel] = useState("");

  // Error message state.
  const [errorMessage, setErrorMessage] = useState({ visible: false, msg: "" });

  // Get dispatcher.
  const dispatch = useDispatch();

  // Handle error message.
  const showError = (msg) => {
    if (errorMessage.visible) {
      return;
    }

    setErrorMessage({ visible: true, msg: Constants.ERROR_MSG_NO_FUNDS });
    setTimeout(() => {
      setErrorMessage({ visible: false, msg: "" });
    }, Constants.ERROR_MSG_SHOW_TIME * 1000);
  };

  // Spin button click event.
  const placeBetEvent = () => {
    if (gameStage === STAGE_NEW_GAME) {
      console.log("CALLED!");
      console.log("CALLED!");
      console.log("CALLED!");
      console.log("CALLED!");
      dispatch(gameStageActions.placeBetStage());
    }
  };

  // Once reel animations are over
  // we go into settlement stage.
  const animationOver = () => {
    dispatch(gameStageActions.settlementStage());
  };

  // Game has started event.
  const startGameEvent = () => {
    SoundUtils.play(Constants.BG_ASSETS.bgMusic, true, 0.6);
    dispatch(gameStageActions.newGameStage());
  };

  // Stepper event dispatch.
  const stepperUpdateEvent = (val) => {
    dispatch(gameStateActions.setStake(val));
  };

  // Handle game stages.
  useEffect(() => {
    switch (gameStage) {
      case STAGE_LOAD:
        //dispatch(gameStageActions.newGameStage());
        break;
      case STAGE_NEW_GAME:
        document.getElementsByClassName(
          Constants.BG_COVER_CLASS
        )[0].style.display = "none";
        break;
      // Place bet called.
      case STAGE_PLACE_BET:
        if (!bankManagerInstance.isBetValid(gameState)) {
          // Show error here.
          showError("");
          // Return game to new game stage.
          dispatch(gameStageActions.newGameStage());
          return;
        }
        // Handle placebet logic.
        let result = bankManagerInstance.placebet(gameState);

        // Set current balance.
        setLabelBalance(result.balance);

        // Update result.
        dispatch(gameStateActions.setResult(result));

        // Move game to placebet success stage.
        dispatch(gameStageActions.placeBetSuccessStage(result));
        break;
      case STAGE_PLACE_BET_SUCCESS:
        dispatch(gameStageActions.BetRunningStage());
        break;
      // Settlement in progress.
      case STAGE_SETTLEMENT:
        // Calculate new balance.
        let newBalance = gameState.balance + gameState.wa;
        // Update label balance.
        setLabelBalance(newBalance);
        // Update balance state.
        dispatch(gameStateActions.setBalance(newBalance));

        if (gameState.status) {
          setTimeout(() => {
            valueReturnTween(
              0.0,
              1.0,
              "power1.out",
              "power1.out",
              2.0,
              0.7,
              (value) => {
                // Set win screen scale value.
                setWinScreenScale(value);
              }
            );

            valueTween(0.0, 1.0, 1.4, "power1.out", (value) => {
              setWinScreenLabel(Math.ceil(gameState.wa * value));
            });
          }, Constants.WIN_PANEL_DISPLAY_MOMENT_SEC * 1000);
        }
        // Settlement break.
        setTimeout(
          () => {
            // Game has ended and ready for new game.
            dispatch(gameStageActions.newGameStage());
          },
          gameState.status === 0 ? 0 : Constants.SETTLEMENT_DURATION * 1000
        );

        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, gameStage]);

  return (
    <>
      {/* Background Statue Right */}
      <Stage options={Constants.STAGE_CONFIG} style={StageStyle}>
        <Sprite
          anchor={0.5}
          texture={PIXI.Texture.from(Constants.BG_ASSETS.anubisLeft)}
          {...Constants.ANUBIS_STATUE_LEFT_BG}
        />

        {/* Background Statue Left */}
        <Sprite
          anchor={0.5}
          texture={PIXI.Texture.from(Constants.BG_ASSETS.osirisRight)}
          {...Constants.OSIRIS_STATUE_RIGHT_BG}
        />

        {/* Reels */}
        <Provider store={store}>
          <ReelHolderComponent callback={animationOver} />
        </Provider>

        {/* Balance Label */}
        <LabelComponent
          x={Constants.BALANCE_LABEL_CONFIG.x}
          y={Constants.BALANCE_LABEL_CONFIG.y}
          width={Constants.BALANCE_LABEL_CONFIG.width}
          height={Constants.BALANCE_LABEL_CONFIG.height}
          text={labelBalance}
        ></LabelComponent>

        {/* Stake Stepper */}
        <StepperComponent
          x={Constants.STEPPER_CONFIG.x}
          y={Constants.STEPPER_CONFIG.y}
          width={Constants.STEPPER_CONFIG.width}
          height={Constants.STEPPER_CONFIG.height}
          initialValue={Constants.INITIAL_GAME_STATE.stake}
          updateCallback={stepperUpdateEvent}
        ></StepperComponent>

        {/* Spin button */}
        <SpriteButtonComponent
          callback={placeBetEvent}
          config={Constants.SPIN_BUTTON_CONFIG}
        ></SpriteButtonComponent>

        {/* Win Panel */}
        <PanelComponent
          scale={winScreenScale}
          x={Constants.WIN_PANEL_CONFIG.x}
          y={Constants.WIN_PANEL_CONFIG.y}
          width={Constants.WIN_PANEL_CONFIG.width}
          height={Constants.WIN_PANEL_CONFIG.height}
          image={Constants.WIN_PANEL_CONFIG.image}
          textConfig={Constants.WIN_PANEL_CONFIG.textConfig}
          text={`${winScreenLabel}$`}
          visible={true}
        ></PanelComponent>

        {/* Dialog Box */}
        <PanelComponent
          x={Constants.DIALOG_BOX_CONFIG.x}
          y={Constants.DIALOG_BOX_CONFIG.y}
          width={Constants.DIALOG_BOX_CONFIG.width}
          height={Constants.DIALOG_BOX_CONFIG.height}
          image={Constants.DIALOG_BOX_CONFIG.image}
          text={errorMessage.msg}
          textConfig={Constants.DIALOG_BOX_CONFIG.textConfig}
          visible={errorMessage.visible}
        ></PanelComponent>

        {/* Start Game Button */}
        <SpriteButtonComponent
          callback={startGameEvent}
          config={Constants.PLAY_BUTTON_CONFIG}
          visible={gameStage === STAGE_LOAD}
        ></SpriteButtonComponent>
      </Stage>
    </>
  );
}

export default GameStageComponent;
