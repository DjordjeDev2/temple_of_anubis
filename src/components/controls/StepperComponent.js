import React, { useRef } from "react";
import { Container, Sprite, Text } from "react-pixi-fiber/index.js";
import * as PIXI from "pixi.js";
import { STEPPER_CONFIG } from "../../constants";
import SoundUtils from "../../utils/SoundUtils";
import { BUTTON_SOUNDS } from "../../constants";

const BUTTON_VOLUME = 0.4;

const StepperComponent = ({
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  minValue = 1,
  maxValue = 1000,
  initialValue = 1,
  step = 1,
  updateCallback,
}) => {
  const valueRef = useRef(initialValue);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const speedRef = useRef(300); // Initial speed (ms)

  const updateValue = (newValue) => {
    valueRef.current = Math.max(minValue, Math.min(maxValue, newValue));
    updateCallback(valueRef.current);
  };

  const handleIncrease = () => {
    SoundUtils.play(BUTTON_SOUNDS.clickSound, false, BUTTON_VOLUME);
    updateValue(valueRef.current + step);
  };

  const handleDecrease = () => {
    SoundUtils.play(BUTTON_SOUNDS.clickSound, false, BUTTON_VOLUME);
    updateValue(valueRef.current - step);
  };

  const startInterval = (action) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      action();
      speedRef.current = Math.max(50, speedRef.current - 50); // Increase speed by decreasing interval time
      clearInterval(intervalRef.current);
      startInterval(action);
    }, speedRef.current);
  };

  const handlePointerDown = (action) => {
    action();
    speedRef.current = 300; // Reset speed on pointer down
    timeoutRef.current = setTimeout(() => {
      startInterval(action);
    }, 500); // Start interval after 500ms
  };

  const handlePointerUp = () => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    speedRef.current = 300; // Reset speed
  };

  return (
    <Container x={x} y={y} width={width} height={height}>
      <Sprite
        texture={PIXI.Texture.from(STEPPER_CONFIG.upTex)}
        anchor={0.5}
        x={STEPPER_CONFIG.rightArrowX}
        y={STEPPER_CONFIG.arrowY}
        width={50}
        height={50}
        interactive
        buttonMode
        pointerdown={() => handlePointerDown(handleIncrease)}
        pointerup={handlePointerUp}
        pointerout={handlePointerUp}
      />
      <Sprite
        texture={PIXI.Texture.from(STEPPER_CONFIG.stepperBoxImage)}
        anchor={0.5}
        x={STEPPER_CONFIG.stepperBoxConfig.x}
        y={STEPPER_CONFIG.stepperBoxConfig.y}
        width={STEPPER_CONFIG.stepperBoxConfig.width}
        height={STEPPER_CONFIG.stepperBoxConfig.height}
      />
      <Text
        text={`${valueRef.current}$`}
        x={STEPPER_CONFIG.labelConfig.x}
        y={STEPPER_CONFIG.labelConfig.y}
        anchor={0.5}
        style={STEPPER_CONFIG.labelConfig.style}
      />
      <Sprite
        texture={PIXI.Texture.from(STEPPER_CONFIG.downTex)}
        anchor={0.5}
        x={STEPPER_CONFIG.leftArrowX}
        y={STEPPER_CONFIG.arrowY}
        width={50}
        height={50}
        interactive
        buttonMode
        pointerdown={() => handlePointerDown(handleDecrease)}
        pointerup={handlePointerUp}
        pointerout={handlePointerUp}
      />
    </Container>
  );
};

export default StepperComponent;
