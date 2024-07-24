import { Container, Sprite } from "react-pixi-fiber/index.js";
import * as PIXI from "pixi.js";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState, useCallback } from "react";
import ReelComponent from "./ReelComponent";
import { MASK_TYPE_RECT } from "./MaskComponent";
import MaskComponent from "./MaskComponent";
import { twoPointT, statesUpdate } from "../../utils/TweenUtil";
import {
  STAGE_BET_RUNNING,
  STAGE_SETTLEMENT,
} from "./../../store/slices/gameStage";

import * as Constants from "../../constants";
import PaylineComponent from "./PaylineComponent";
import bankManagerInstance from "../../bank/BankManager";

// initial reel positions.
const INITIAL_REEL_STATE = [
  Constants.REEL_START_Y,
  Constants.REEL_INITIAL_POS_Y[0],
  Constants.REEL_RESET_POS_Y,
];

// Initial reel results.
const INITIAL_REEL_RESULTS = Array(Constants.REEL_ROWS_TOTAL).fill(
  Constants.INITIAL_GAME_STATE.result
);

function ReelHolderComponent(props) {
  const [iconResult, setIconResult] = useState(INITIAL_REEL_RESULTS);
  const [reelHolderPosY, setReelHolderY] = useState(INITIAL_REEL_STATE);

  // Handles game stages.
  const gameStage = useSelector((state) => state.gameStage.stage);

  // Handles game states.
  const gameState = useSelector((state) => state.gameState);

  // keeps track of our ticker.
  const ticker = useRef(null);

  // cleanup ticker callback.
  const cleanUpTicker = useCallback(() => {
    if (ticker.current) {
      ticker.current.stop();
      ticker.current.destroy();
      ticker.current = null;
    }
  }, []);

  // Resets the reels.
  const resetReels = useCallback(() => {
    setReelHolderY(INITIAL_REEL_STATE);
  }, []);

  // Update icon reel result specified by ID.
  const updateIconResult = useCallback((index, newValue) => {
    setIconResult((prevIconResult) => {
      const newIconResult = [...prevIconResult];
      newIconResult[index] = newValue;
      return newIconResult;
    });
  }, []);

  // Handles reel loop animation.
  const handleReelLoop = useCallback(() => {
    return new Promise((resolve) => {
      // Keeps track of cycles.
      let cycleCounter = 0;

      // Random distribution of icons for outside reels.
      let randomDist = bankManagerInstance.getRandomReelDestribution();

      // Keeps track of results set.
      let resultSet = Array(Constants.REEL_ROWS_TOTAL).fill(false);

      // Main loop callback.
      const loopCallback = (delta) => {
        if (cycleCounter >= Constants.REEL_ANIMATION_CYCLES) {
          // Stop current ticker.
          ticker.current.stop();

          // Remove ticker callback.
          ticker.current.remove(loopCallback);

          // Make sure reels are in correct positions.
          resetReels();

          // Finish animation.
          resolve();
          return;
        }

        setReelHolderY((prevYValues) => {
          // Pass through Y positions of reels.
          return prevYValues.map((yValue, index) => {
            // Check if we have passed reel reset point.
            if (yValue >= Constants.REEL_RESET_POS_Y) {
              // Check if the last reel has made a full cycle.
              if (index === Constants.REEL_ICON_COUNT - 1) {
                // Increase cycle count.
                cycleCounter++;
              }

              // Check if we have set the result for current reel.
              if (!resultSet[index]) {
                // In case we haven't.
                resultSet[index] = true;
                // Check if it's the main reel.
                if (index === 0) {
                  // Set result on main reel.
                  updateIconResult(0, gameState.result);
                } else {
                  // Set random distribution result on outside reel.
                  updateIconResult(index, randomDist);
                }
              }
              // Return new Y reset position.
              return (
                Constants.REEL_INITIAL_POS_Y[1] +
                (yValue - Constants.REEL_RESET_POS_Y)
              );
            } else {
              // Otherwise move reels down and apply delta.
              // So animation is the same regardless of the performance.
              return yValue + Constants.REEL_SPEED * delta;
            }
          });
        });
      };

      // Add loop callback to the ticker.
      ticker.current.add(loopCallback);
    });
  }, [resetReels, updateIconResult, gameState.result]);

  // Handles overall animation.
  useEffect(() => {
    if (gameStage !== STAGE_BET_RUNNING) {
      return;
    }

    // Cleanup our ticker.
    cleanUpTicker();

    // Initialize new ticker.
    ticker.current = new PIXI.Ticker();

    // Define reel start tween animation.
    twoPointT(
      Constants.REEL_SPRING_START_CONFIG.startVal,
      Constants.REEL_SPRING_START_CONFIG.endVal,
      Constants.REEL_SPRING_START_CONFIG.easeOne,
      Constants.REEL_SPRING_START_CONFIG.easeTwo,
      Constants.REEL_SPRING_START_CONFIG.durationOne,
      Constants.REEL_SPRING_START_CONFIG.durationTwo,

      // Update states callback.
      statesUpdate(setReelHolderY)
    )
      // Handle reel loop animation.
      .then(() => handleReelLoop())
      // Handle reel stop animation.
      .then(() =>
        twoPointT(
          Constants.REEL_END_HIT_CONFIG.startVal,
          Constants.REEL_END_HIT_CONFIG.endVal,
          Constants.REEL_END_HIT_CONFIG.easeOne,
          Constants.REEL_END_HIT_CONFIG.easeTwo,
          Constants.REEL_END_HIT_CONFIG.durationOne,
          Constants.REEL_END_HIT_CONFIG.durationTwo,
          statesUpdate(setReelHolderY)
        )
      )
      // Animation has ended, execute callback.
      .then(() => {
        props.callback();
      });

    // Start current animation.
    ticker.current.start();

    // Cleanup.
    return () => {
      cleanUpTicker();
    };
  }, [gameStage, handleReelLoop, props, cleanUpTicker]);

  return (
    <Sprite
      x={Constants.REEL_HOLDER_X}
      y={0}
      anchor={0}
      width={Constants.REEL_HOLDER_WIDTH}
      height={Constants.REEL_HOLDER_HEIGHT}
      texture={PIXI.Texture.from(Constants.BG_ASSETS.reelHolder)}
      scale={1}
      {...props}
    >
      {/* Mask our reels component */}
      <MaskComponent
        maskType={MASK_TYPE_RECT}
        config={Constants.REEL_MASK_CONFIG}
      >
        {/* Loop through our reel rows */}
        {Array.from(
          { length: Constants.REEL_ROWS_TOTAL },
          (_, reelsHolderColumnIndex) => (
            <Container
              key={reelsHolderColumnIndex}
              x={0}
              y={reelHolderPosY[reelsHolderColumnIndex]}
              width={Constants.REEL_HOLDER_WIDTH}
              height={Constants.REEL_HOLDER_HEIGHT}
              scale={1}
            >
              {/* Loop through each reel inside a holder */}
              {Array.from({ length: Constants.REEL_COUNT }, (_, reelIndex) => (
                <ReelComponent
                  key={reelIndex}
                  reelHolderID={reelsHolderColumnIndex}
                  reelID={reelIndex}
                  icons={iconResult[reelsHolderColumnIndex][reelIndex]}
                  xPos={
                    Constants.REEL_START_POS_X +
                    Constants.REEL_OFFSET_X * reelIndex
                  }
                  yPos={0}
                />
              ))}
            </Container>
          )
        )}
      </MaskComponent>

      {/* Paylines */}
      {Array.from({ length: Constants.PAYLINE_COUNT }, (_, index) => (
        <PaylineComponent
          key={index}
          x={Constants.PAYLINE_START_X}
          y={Constants.PAYLINE_START_Y + Constants.PAYLINE_OFFSET_Y * index}
          width={Constants.PAYLINE_WIDTH}
          height={Constants.PAYLINE_HEIGHT}
          visible={gameStage === STAGE_SETTLEMENT && gameState.pa[index]}
          anchor={0}
        />
      ))}
    </Sprite>
  );
}

export default ReelHolderComponent;
