import gsap from "gsap";

// Tween update function.
export const statesUpdate = (stateSet) => {
  return function () {
    const newY = this.targets()[0].y;
    stateSet((prevPosY) => prevPosY.map((val) => val + newY - prevPosY[0]));
  };
};

// Two connected point tween
export const twoPointT = (
  jumpFrom,
  jumpTo,
  easeOne,
  easeTwo,
  duraOne,
  duraTwo,
  updateCallback
) => {
  return new Promise((resolve) => {
    const tl = gsap.timeline();
    tl.to(
      { y: jumpFrom },
      {
        y: jumpTo,
        duration: duraOne,
        ease: easeOne,
        onUpdate: updateCallback,
      }
    ).to(
      { y: jumpTo },
      {
        y: jumpFrom,
        duration: duraTwo,
        ease: easeTwo,
        onUpdate: updateCallback,
        onComplete: () => {
          resolve();
        },
      }
    );
  });
};

// Tween for a single value.
export const valueTween = (
  startValue,
  endValue,
  duration,
  ease = "",
  updateCallback
) => {
  return new Promise((resolve) => {
    let target = { value: startValue };
    gsap.to(target, {
      value: endValue,
      duration: duration,
      ease: ease,
      onUpdate: () => {
        updateCallback(target.value);
      },
      onComplete: () => {
        resolve();
      },
    });
  });
};

// Tween between two values.
export const valueReturnTween = (
  startValue,
  endValue,
  easeOne,
  easeTwo,
  duraOne,
  duraTwo,
  updateCallback
) => {
  return new Promise((resolve) =>
    valueTween(startValue, endValue, duraOne, easeOne, updateCallback)
      .then(() => {
        valueTween(endValue, startValue, duraTwo, easeTwo, updateCallback);
      })
      .then(() => {
        resolve();
      })
  );
};
