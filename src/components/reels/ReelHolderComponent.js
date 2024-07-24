import { Container, Sprite } from "react-pixi-fiber/index.js";
import * as PIXI from "pixi.js";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
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

const INITIAL_REEL_STATE = [
  Constants.REEL_START_Y,
  Constants.REEL_INITIAL_POS_Y[0],
  Constants.REEL_RESET_POS_Y,
];

const INITIAL_REEL_RESULTS = Array(Constants.REEL_ROWS_TOTAL).fill(
  Constants.INITIAL_GAME_STATE.result
);

function ReelHolderComponent(props) {
  // Set initial reel result.
  const [iconResult, setIconResult] = useState(INITIAL_REEL_RESULTS);

  // Reel Y position states.
  const [reelHolderPosY, setReelHolderY] = useState(INITIAL_REEL_STATE);

  // Game stage redux selector.
  const gameStage = useSelector((state) => state.gameStage.stage);

  // Game state redux selector.
  const gameState = useSelector((state) => state.gameState);

  // Ticker reference.
  const ticker = useRef(null);

  // Resets reels back to initial position.
  function resetReels() {
    setReelHolderY(INITIAL_REEL_STATE);
  }

  // Function to update a specific element in the array
  const updateIconResult = (index, newValue) => {
    setIconResult((prevIconResult) => {
      // Create an array clone.
      const newIconResult = [...prevIconResult];
      // Override desired row.
      newIconResult[index] = newValue;
      return newIconResult;
    });
  };

  // Clean up ticker.
  function cleanUpTicker() {
    if (ticker.current) {
      ticker.current.stop();
      ticker.current.destroy();
      ticker.current = null;
    }
  }

  // Handles reel loop animation.
  function handleReelLoop() {
    return new Promise((resolve) => {
      // Keep track of cycles.
      let cycleCounter = 0;

      // Get random destribution.
      let randomDist = bankManagerInstance.getRandomReelDestribution();

      // Keep track of reel results.
      let resultSet = Array(Constants.REEL_ROWS_TOTAL).fill(false);

      const loopCallback = (delta) => {
        // Check if we have passed reel loop cycles.
        if (cycleCounter >= Constants.REEL_ANIMATION_CYCLES) {
          // Stop Ticker and remove callback.
          ticker.current.stop();

          // Remove callback from the ticker.
          ticker.current.remove(loopCallback);

          // Reset reels.
          resetReels();

          // Resolve animation.
          resolve();
          return;
        }

        setReelHolderY((prevYValues) => {
          return prevYValues.map((yValue, index) => {
            // Check if the current reel has passed reset position.
            if (yValue >= Constants.REEL_RESET_POS_Y) {
              // Check if it's the last reel, so we can count
              // a full cycle.
              if (index === Constants.REEL_ICON_COUNT - 1) {
                // Increase cycle count.
                cycleCounter++;
              }

              // Check if we have set new result for this reel.
              if (!resultSet[index]) {
                // If not we are setting it now.
                resultSet[index] = true;
                // Check if it's the first reel.
                if (index === 0) {
                  // Set result for the main reel.
                  updateIconResult(0, gameState.result);
                } else {
                  // Set random distribution for outside reel.
                  updateIconResult(index, randomDist);
                }
              }

              // Reset position of current reel.
              return (
                Constants.REEL_INITIAL_POS_Y[1] +
                (yValue - Constants.REEL_RESET_POS_Y)
              );
            } else {
              // Proceed with the reel drop.
              return yValue + Constants.REEL_SPEED * delta;
            }
          });
        });
      };

      // Add loop callback.
      ticker.current.add(loopCallback);
    });
  }

  // Handle animation logic.
  useEffect(() => {
    if (gameStage !== STAGE_BET_RUNNING) {
      return;
    }

    // Clean up old ticker.
    cleanUpTicker();

    // Create new one.
    ticker.current = new PIXI.Ticker();

    // Start reel push animation.
    twoPointT(
      0,
      -100,
      "power1.out",
      "power1.in",
      0.5,
      0.17,
      statesUpdate(setReelHolderY)
    )
      // Handle reel loop animation.
      .then(() => handleReelLoop())
      // Handle reel stop animation.
      .then(() =>
        twoPointT(
          0,
          -50,
          "",
          "elastic.out(1,0.3)",
          0.1,
          1.5,
          statesUpdate(setReelHolderY)
        )
      )
      .then(() => {
        // Animation over callback.
        props.callback();
      });

    // Enable ticker.
    ticker.current.start();

    // Cleanup callback.
    return () => {
      cleanUpTicker();
    };
  }, [gameStage]);

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
      {/* Component to mask our reels */}
      <MaskComponent
        maskType={MASK_TYPE_RECT}
        config={Constants.REEL_MASK_CONFIG}
      >
        {/* Loop through reel row */}
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
              {/* Loop through each reel */}
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
