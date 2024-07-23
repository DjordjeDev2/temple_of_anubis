import { Sprite, Text, Container } from "react-pixi-fiber/index.js";
import * as PIXI from "pixi.js";

const PanelComponent = ({
  text = "1000",
  x = 0,
  y = 0,
  width = 200,
  height = 100,
  image,
  visible = false,
  textConfig,
  scale,
}) => {
  return (
    <Container
      x={x}
      y={y}
      width={width}
      height={height}
      anchor={0.5}
      scale={scale}
    >
      {/* Background Sprite */}
      <Sprite
        texture={PIXI.Texture.from(image)}
        anchor={0.5}
        x={0}
        y={0}
        width={width}
        height={height}
        visible={visible}
      />
      {/* Text Label */}
      <Text text={`${text}`} visible={visible} {...textConfig} />
    </Container>
  );
};

export default PanelComponent;
