import { Sprite } from "react-pixi-fiber/index.js";
import { REEL_ICON_COUNT } from "../../constants";
import SymbolComponent from "./symbols/SymbolComponent";
import React, { useEffect, useState } from "react";
import { valueReturnTween } from "../../utils/TweenUtil";
import { useSelector } from "react-redux";
import { STAGE_SETTLEMENT } from "../../store/slices/gameStage";
import { useRef } from "react";
import * as PIXI from "pixi.js";
import {
  VERTEX_SHADER_BASE,
  FRAGMENT_SHADER_SHINE,
} from "../../graphics/shaders/ShaderData";

const shineFilter = new PIXI.Filter(VERTEX_SHADER_BASE, FRAGMENT_SHADER_SHINE, {
  intensity: 1.0,
});

function ReelComponent({ xPos, yPos, icons, reelHolderID, reelID }) {
  const [symbolScale, setSymbolScale] = useState({ x: 1.0, y: 1.0 });
  const idleScale = { x: 1.0, y: 1.0 };
  const animationRunning = useRef(false);

  // Game stage redux selector.
  const gameStage = useSelector((state) => state.gameStage.stage);
  // Game state redux selector.
  const gameState = useSelector((state) => state.gameState);

  useEffect(() => {
    // Check if we are in the settlement stage
    // and is the main reel.
    if (gameStage !== STAGE_SETTLEMENT || reelHolderID !== 0) {
      return;
    }

    // Check if animation is playing.
    if (animationRunning.current) {
      return;
    }

    // Animation is playing now.
    animationRunning.current = true;

    // Play icon animation.
    valueReturnTween(1.0, 1.2, "", "", 0.9, 0.9, (value) => {
      setSymbolScale({ x: value, y: value });
    });

    // Handle shine effect.
    valueReturnTween(1.0, 1.4, "", "", 1.0, 1.0, (value) => {
      shineFilter.uniforms.intensity = value;
    }).then(() => {
      animationRunning.current = false;
    });
  }, [gameStage, reelHolderID]);

  return (
    <Sprite x={xPos} y={yPos}>
      {Array.from({ length: REEL_ICON_COUNT }, (_, index) => (
        <SymbolComponent
          key={index}
          iconPos={index}
          icon={icons[index]}
          filter={
            gameStage === STAGE_SETTLEMENT && reelID < gameState.palen[index]
              ? [shineFilter]
              : null
          }
          scale={
            gameStage === STAGE_SETTLEMENT && reelID < gameState.palen[index]
              ? symbolScale
              : idleScale
          }
        ></SymbolComponent>
      ))}
    </Sprite>
  );
}

export default ReelComponent;
