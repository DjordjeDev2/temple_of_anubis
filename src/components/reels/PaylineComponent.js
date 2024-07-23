import { Sprite } from "react-pixi-fiber/index.js";
import PAYLINE_TEX from "../../assets/reels/Payline.png";
import * as PIXI from "pixi.js";

function PaylineComponent(props) {
  return (
    <Sprite anchor={0.5} texture={PIXI.Texture.from(PAYLINE_TEX)} {...props} />
  );
}

export default PaylineComponent;
