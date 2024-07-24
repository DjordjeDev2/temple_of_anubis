import * as PIXI from "pixi.js";

// Assets.
import IconA from "../assets/reels/symbols/Icon_A.png";
import IconB from "../assets/reels/symbols/Icon_B.png";
import IconC from "../assets/reels/symbols/Icon_C.png";
import IconD from "../assets/reels/symbols/Icon_D.png";
import IconE from "../assets/reels/symbols/Icon_E.png";
import IconF from "../assets/reels/symbols/Icon_F.png";
import IconG from "../assets/reels/symbols/Icon_G.png";
import IconH from "../assets/reels/symbols/Icon_H.png";
import IconI from "../assets/reels/symbols/Icon_I.png";
import ARROW_UP_TEX from "../assets/buttons/ArrowUp.png";
import ARROW_DOWN_TEX from "../assets/buttons/ArrowDown.png";
import STEPPER_BOX_TEX from "../assets/StepperBox.jpeg";
import ANUBIS_BG_LEFT_TEX from "../assets/AnubisBG.png";
import OSIRIS_BG_RIGHT_TEX from "../assets/OsirisBG.png";
import REEL_HOLDER_TEX from "../assets/reels/ReelHolder.png";
import PLAY_BUTTON_TEX from "../assets/PlayBG.png";
import BG_MUSIC_LOOP from "../assets/music/BGMusic.mp3";
import BUTTON_CLICK_SOUND from "../assets/sound/ButtonClick.wav";
import SPIN_BUTTON_TEX from "../assets/buttons/SpinButton.png";
import TRANSPARENT_BG from "../assets/Transparent_BG.png";
import WIN_PANEL_TEX from "../assets/WinPanel.png";
import DIALOG_BOX_TEX from "../assets/DialogBox.jpeg";

// Game Bank

export const INITIAL_BALANCE = 1000;
export const FORCE_WIN_GAME = 4;
export const WIN_LINE_ICON_LEN = 3;

export const INITIAL_GAME_STATE = {
  status: 0,
  pa: [false, false, false],
  palen: [0, 0, 0],
  result: [
    [1, 0, 7],
    [2, 6, 8],
    [5, 2, 4],
    [2, 3, 6],
    [7, 5, 2],
  ],
  wa: 0,
  stake: 100,
  balance: INITIAL_BALANCE,
};

// Result for outside reels.
export const REEL_EXTERNAL_RESULT = [
  [1, 1, 3],
  [5, 0, 1],
  [8, 4, 0],
  [2, 5, 8],
  [1, 2, 4],
];

// Game Stage

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

export const BG_COVER_CLASS = "bg-cover";

export const STAGE_CONFIG = {
  backgroundColor: 0x000000,
  transparent: true,
  resolution: 1,
  x: 100,
  anchor: 0.5,
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
};

export const ANUBIS_STATUE_LEFT_BG = {
  x: 140,
  y: 486,
  width: 500,
  height: 700,
  zIndex: 1,
};

export const OSIRIS_STATUE_RIGHT_BG = {
  x: 1780,
  y: 520,
  width: 400,
  height: 670,
  zIndex: 1,
};

export const BG_ASSETS = {
  anubisLeft: ANUBIS_BG_LEFT_TEX,
  osirisRight: OSIRIS_BG_RIGHT_TEX,
  reelHolder: REEL_HOLDER_TEX,
  bgMusic: BG_MUSIC_LOOP,
};

// Reels

export const REEL_SPEED = 45;
export const REEL_ANIMATION_CYCLES = 3;
export const REEL_HOLDER_WIDTH = STAGE_WIDTH * 0.8;
export const REEL_HOLDER_HEIGHT = STAGE_HEIGHT * 0.8;
export const REEL_HOLDER_X = (STAGE_WIDTH - REEL_HOLDER_WIDTH) / 2;

export const REEL_COUNT = 5;
export const REEL_ICON_COUNT = 3;
export const REEL_WIDTH = REEL_HOLDER_WIDTH * 0.134;
export const REEL_START_POS_X = -12;
export const REEL_OFFSET_X = REEL_HOLDER_WIDTH * 0.124;

export const REEL_START_Y = 0;
export const REEL_RESET_POS_Y = REEL_HOLDER_HEIGHT * 0.72;

export const REEL_ROWS_TOTAL = 3;

export const REEL_INITIAL_POS_Y = [
  -1 * REEL_HOLDER_HEIGHT * 0.72,
  -2 * REEL_HOLDER_HEIGHT * 0.72,
];

// Reel Mask
export const REEL_MASK_CONFIG = {
  x: 0,
  y: REEL_HOLDER_HEIGHT * 0.027,
  width: REEL_HOLDER_WIDTH * 0.7,
  height: REEL_HOLDER_HEIGHT * 0.8,
};

// Reel Symbols
export const SYMB_ENUM = {
  Icon_A: 0,
  Icon_B: 1,
  Icon_C: 2,
  Icon_D: 3,
  Icon_E: 4,
  Icon_F: 5,
  Icon_G: 6,
  Icon_H: 7,
  Icon_I: 8,
};

export const SYMBOL_ASSETS = [
  IconA,
  IconB,
  IconC,
  IconD,
  IconE,
  IconF,
  IconG,
  IconH,
  IconI,
];

// Paylines

export const PAYLINE_COUNT = 3;
export const PAYLINE_START_X = 90;
export const PAYLINE_START_Y = 120;
export const PAYLINE_OFFSET_Y = 200;
export const PAYLINE_WIDTH = 808;
export const PAYLINE_HEIGHT = 100;

export const REEL_ICON_WIDTH = REEL_WIDTH * 0.8;
export const REEL_ICON_HEIGHT = REEL_WIDTH;
export const REEL_ICON_OFFSET_X = 40;
export const REEL_ICON_OFFSET_Y = REEL_HOLDER_HEIGHT * 0.182;

// Controls

// Spin Button

export const BUTTON_SOUNDS = {
  clickSound: BUTTON_CLICK_SOUND,
};

export const SPIN_BUTTON_CONFIG = {
  x: STAGE_WIDTH * 0.5,
  y: STAGE_HEIGHT * 0.83,
  width: STAGE_WIDTH * 0.17,
  height: STAGE_HEIGHT * 0.3,
  image: SPIN_BUTTON_TEX,
};

export const PLAY_BUTTON_CONFIG = {
  x: STAGE_WIDTH * 0.5,
  y: STAGE_HEIGHT * 0.4,
  width: STAGE_WIDTH * 0.4,
  height: STAGE_HEIGHT * 0.5,
  image: PLAY_BUTTON_TEX,
  transparentBG: TRANSPARENT_BG,
};

// Stepper

export const STEPPER_CONFIG = {
  x: 260,
  y: 320,
  width: 630,
  height: 160,
  rightArrowX: 210,
  leftArrowX: -10,
  arrowY: 200,
  upTex: ARROW_UP_TEX,
  downTex: ARROW_DOWN_TEX,
  stepperBoxImage: STEPPER_BOX_TEX,
  stepperBoxConfig: {
    x: 100,
    y: 200,
    width: 170,
    height: 50,
  },
  labelConfig: {
    x: 100,
    y: 200,
    width: 70,
    height: 30,
  },
  style: new PIXI.TextStyle({
    fontSize: 36,
    fill: "#00000",
    align: "center",
    fontWeight: "bold",
  }),
};

// Balance label

export const BALANCE_LABEL_CONFIG = {
  x: 960,
  y: 40,
  width: 300,
  height: 70,
};

// Win Panel

export const WIN_PANEL_CONFIG = {
  x: 960,
  y: 450,
  width: 800,
  height: 900,
  image: WIN_PANEL_TEX,
  textConfig: {
    x: -57,
    y: 175,
    width: 120,
    height: 70,
    style: new PIXI.TextStyle({
      fontSize: 36,
      fill: "#FFFFFF",
      align: "center",
      fontWeight: "bold",
    }),
  },
};

export const DIALOG_BOX_CONFIG = {
  x: 960,
  y: 450,
  width: 800,
  height: 250,
  image: DIALOG_BOX_TEX,
  textConfig: {
    x: -215,
    y: -45,
    width: 400,
    height: 70,
    style: new PIXI.TextStyle({
      fontSize: 36,
      fill: "#00000",
      align: "center",
      fontWeight: "bold",
    }),
  },
};

// Animation

export const REEL_SPRING_START_CONFIG = {
  startVal: 0,
  endVal: -100,
  easeOne: "power1.out",
  easeTwo: "power1.in",
  durationOne: 0.5,
  durationTwo: 0.17,
};

export const REEL_END_HIT_CONFIG = {
  startVal: 0,
  endVal: -50,
  easeOne: "",
  easeTwo: "elastic.out(1,0.3)",
  durationOne: 0.1,
  durationTwo: 1.5,
};

export const WIN_PANEL_DISPLAY_MOMENT_SEC = 1.3;

// Settlement win time in seconds
export const SETTLEMENT_DURATION = 3.3;

// Win animations in second.
export const WIN_ANIM_DURATION = 1.4;

// Error Messages

export const ERROR_MSG_SHOW_TIME = 1.3;

export const ERROR_MSG_NO_FUNDS = "insufficient funds";
