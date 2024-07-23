import * as PIXI from "pixi.js";
import { Container, Sprite } from "react-pixi-fiber/index.js";
import { useState } from "react";
import { valueReturnTween } from "../../utils/TweenUtil";
import SoundUtils from "../../utils/SoundUtils";
import { BUTTON_SOUNDS } from "../../constants";

const BUTTON_JUMP_AMOUNT = 1.1;
const BUTTON_JUMP_DURATION = 0.4;
const BUTTON_VOLUME = 0.4;

function SpriteButtonComponent({ config, callback, visible = true }) {
  const [curScale, setScale] = useState(1.0);

  const buttonClickEffect = () => {
    SoundUtils.play(BUTTON_SOUNDS.clickSound, false, BUTTON_VOLUME);

    valueReturnTween(
      1.0,
      BUTTON_JUMP_AMOUNT,
      "",
      "",
      BUTTON_JUMP_DURATION,
      BUTTON_JUMP_DURATION,
      (value) => {
        setScale(value);
      }
    );

    callback();
  };

  return (
    <Container anchor={0} scale={curScale} x={config.x} y={config.y}>
      <Sprite
        anchor={0.5}
        interactive
        buttonMode
        pointerdown={buttonClickEffect}
        texture={PIXI.Texture.from(config.image)}
        x={0}
        y={0}
        width={config.width}
        height={config.height}
        visible={visible}
      />
    </Container>
  );
}

export default SpriteButtonComponent;
