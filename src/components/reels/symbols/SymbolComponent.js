import { Container, Sprite } from "react-pixi-fiber/index.js";
import * as PIXI from "pixi.js";

import {
  REEL_WIDTH,
  REEL_ICON_OFFSET_X,
  REEL_ICON_OFFSET_Y,
  REEL_ICON_WIDTH,
  REEL_ICON_HEIGHT,
  SYMBOL_ASSETS,
} from "../../../constants";

function SymbolComponent({ iconPos, icon, scale, filter }) {
  let symbolAsset = SYMBOL_ASSETS[icon];

  return (
    <Container
      x={REEL_ICON_OFFSET_X + REEL_ICON_WIDTH / 2}
      y={REEL_WIDTH * iconPos + REEL_ICON_OFFSET_Y}
      anchor={0.5}
      scale={scale}
    >
      <Sprite
        anchor={0.5}
        width={REEL_ICON_WIDTH}
        height={REEL_ICON_HEIGHT}
        texture={PIXI.Texture.from(symbolAsset)}
        filters={filter}
      />
    </Container>
  );
}

export default SymbolComponent;
