import { Container, Sprite } from "react-pixi-fiber/index.js";
import * as PIXI from "pixi.js";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import ReelComponent from "./ReelComponent";
import { MASK_TYPE_RECT } from "./MaskComponent";
import MaskComponent from "./MaskComponent";
import { twoPointT, statesUpdate } from "../../utils/TweenUtil";
import {
  gameStageActions,
  STAGE_BET_RUNNING,
  STAGE_SETTLEMENT,
} from "./../../store/slices/gameStage";

import * as Constants from "../../constants";
import PaylineComponent from "./PaylineComponent";

const INITIAL_REEL_STATE = [
  Constants.REEL_START_Y,
  Constants.REEL_INITIAL_POS_Y[0],
  Constants.REEL_RESET_POS_Y,
];

function ReelHolderComponent(props) {
  // Set initial reel result.
  const [iconResult, setIconResult] = useState(
    Constants.INITIAL_GAME_STATE.result
  );

  // Reel Y position states.
  const [reelHolderPosY, setReelHolderY] = useState(INITIAL_REEL_STATE);

  // Game stage redux selector.
  const gameStage = useSelector((state) => state.gameStage.stage);

  // Game state redux selector.
  const gameState = useSelector((state) => state.gameState);

  // Ticker reference.
  const ticker = useRef(null);

  // Event dispatcher.
  const dispatch = useDispatch();

  // Resets reels back to initial position.
  function resetReels() {
    setReelHolderY(INITIAL_REEL_STATE);
  }

  // Clean up ticker.
  function cleanUpTicker() {
    if (ticker.current) {
      ticker.current.stop();
      ticker.current.destroy();
      ticker.current = null;
    }
  }

  function handleReelLoop() {
    return new Promise((resolve) => {
      // Keep track of cycles.
      let cycleCounter = 0;
      let newResultSet = false;

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
            // Check if main reel has passed starting area.
            if (yValue >= Constants.REEL_RESET_POS_Y) {
              // Check if last reel has passed reset point.
              if (index === Constants.REEL_ICON_COUNT - 1) {
                // Increase cycle count.
                cycleCounter++;
              }

              // Check if the main reel is outside visible area.
              if (!newResultSet && index === 0) {
                // Set new result.
                setIconResult(gameState.result);
                newResultSet = true;
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
      return <></>;
    }

    // Clean up old ticker.
    cleanUpTicker();

    // Create new one.
    ticker.current = new PIXI.Ticker();

    // Start reel animation.
    twoPointT(
      0,
      -100,
      "power1.out",
      "power1.in",
      0.5,
      0.17,
      statesUpdate(setReelHolderY)
    )
      .then(() => handleReelLoop())
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
        // Do win animations here.
        dispatch(gameStageActions.settlementStage());
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
      <MaskComponent
        maskType={MASK_TYPE_RECT}
        config={Constants.REEL_MASK_CONFIG}
      >
        {/* Loop through reel holder */}
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
                  icons={
                    reelsHolderColumnIndex === 0
                      ? iconResult[reelIndex]
                      : Constants.REEL_EXTERNAL_RESULT[reelIndex]
                  }
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
