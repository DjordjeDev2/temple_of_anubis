import { Sprite, Text, Container } from "react-pixi-fiber/index.js";
import * as PIXI from "pixi.js";

import LABEL_BACKGROUND from "../../assets/BalanceBox.png"; // Import your background image

const LabelComponent = ({
  text,
  x = 0,
  y = 0,
  width = 200,
  height = 100,
  textConfig,
}) => {
  return (
    <Container x={x} y={y} width={width} height={height}>
      {/* Background Sprite */}
      <Sprite
        texture={PIXI.Texture.from(LABEL_BACKGROUND)}
        anchor={0.5}
        x={0}
        y={0}
        width={width}
        height={50}
      />
      {/* Text Label */}
      <Text
        text={`${text}$`}
        x={textConfig.x}
        y={textConfig.y}
        height={textConfig.height}
        width={textConfig.width}
        anchor={0.5}
        style={
          new PIXI.TextStyle({
            fontSize: 36,
            fill: "#00000",
            align: "center",
            fontWeight: "bold",
          })
        }
      />
    </Container>
  );
};

export default LabelComponent;
