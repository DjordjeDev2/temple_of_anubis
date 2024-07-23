import { Container, Graphics } from "react-pixi-fiber/index.js";
import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";

export const MASK_TYPE_RECT = 0;
export const MASK_TYPE_CIRCLE = 1;

// Draw mask circle container.
const drawMaskCircle = (x, y, r) => {
  const graphics = new PIXI.Graphics();
  graphics.clear();
  graphics.beginFill();
  graphics.drawCircle(x, y, r);
  graphics.endFill();
  return graphics;
};

// Draw mask rectangle container.
const drawMaskRectangle = (graphics, x, y, w, h) => {
  graphics.beginFill(0xffffff);
  graphics.drawRect(x, y, w, h);
  graphics.endFill();
  return graphics;
};

const MaskComponent = ({ draw, children, maskType, config }) => {
  const maskRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (maskRef.current && containerRef.current) {
      // Ensure mask is fully drawn before applying
      maskRef.current.clear();

      if (maskType === MASK_TYPE_RECT) {
        drawMaskRectangle(
          maskRef.current,
          config.x,
          config.y,
          config.width,
          config.height
        );
      } else {
        drawMaskCircle(maskRef.current, config.x, config.y, config.r);
      }

      containerRef.current.mask = maskRef.current;
    }
  }, [
    config.height,
    config.r,
    config.width,
    config.x,
    config.y,
    draw,
    maskType,
  ]);

  return (
    <Container ref={containerRef}>
      <Graphics ref={maskRef} />
      <Container>{children}</Container>
    </Container>
  );
};

export default MaskComponent;
