import { WIN_LINE_ICON_LEN, REEL_COUNT, REEL_ICON_COUNT } from "../constants";

class ResultGenerator {
  constructor() {
    this.icons = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  generateBooleanArray(len) {
    // Create an array filled with false values
    const result = new Array(len).fill(false);

    // Ensure at least one true value
    const guaranteedTrueIndex = Math.floor(Math.random() * len);
    result[guaranteedTrueIndex] = true;

    // Increase the probability of having more true values
    const probabilityOfMoreTrue = 0.4; // Adjust this probability as needed
    for (let i = 0; i < len; i++) {
      if (Math.random() < probabilityOfMoreTrue) {
        result[i] = true;
      }
    }

    return result;
  }

  // Generate a random result for each reel
  generateResult(forceWin = false) {
    const result = [];

    if (forceWin) {
      // Generate a winning line
      const winIcon = this.getRandomIcon();
      const winLen =
        WIN_LINE_ICON_LEN + Math.floor(Math.random() * WIN_LINE_ICON_LEN);
      const winningRows = this.generateBooleanArray(REEL_ICON_COUNT);

      for (let i = 0; i < REEL_COUNT; i++) {
        if (i < winLen) {
          result.push(
            this.generateWinReel(REEL_ICON_COUNT, winningRows, winIcon)
          );
        } else {
          result.push(this.generateRandomReel());
        }
      }
    } else {
      for (let i = 0; i < REEL_COUNT; i++) {
        result.push(this.generateRandomReel());
      }
    }

    return result;
  }

  generateWinReel(len, winRows, winIcon) {
    let reel = [];
    for (let i = 0; i < len; i++) {
      if (winRows[i]) {
        reel.push(winIcon);
      } else {
        reel.push(this.getRandomIcon());
      }
    }
    return reel;
  }

  // Generate a single reel with random icons
  generateRandomReel() {
    return Array.from({ length: REEL_ICON_COUNT }, () => this.getRandomIcon());
  }

  // Get a random icon from available icons
  getRandomIcon() {
    return this.icons[Math.floor(Math.random() * this.icons.length)];
  }

  // Check if there is a winning payline
  checkWin(result) {
    const paylines = [false, false, false];
    const payLinesLen = [0, 0, 0];
    let multiplier = 1;

    // Iterate over each possible payline (from 0 to 2 for a 3-row game)
    for (let row = 0; row < REEL_ICON_COUNT; row++) {
      const icons = result.map((reel) => reel[row]);

      // Check for contiguous sequences of the same icon with at least length of 3
      let count = 1;
      for (let i = 1; i < icons.length; i++) {
        if (icons[0] === icons[i]) {
          count++;
        } else {
          break;
        }

        // If we have at least 3 contiguous icons
        if (count >= WIN_LINE_ICON_LEN) {
          paylines[row] = true;
          payLinesLen[row] = count;
          //break;
        }
      }

      // More icons connected higher multiplier.
      if (count > WIN_LINE_ICON_LEN - 1) {
        multiplier *= count;
      }
    }

    return { pl: paylines, palen: payLinesLen, mult: multiplier };
  }

  // Generate the result object
  generateResultObject(forceWin = false) {
    let result = this.generateResult(forceWin);
    let winCheck = this.checkWin(result);
    const palen = winCheck.palen;
    const paylineArray = winCheck.pl;
    const mult = winCheck.mult;
    const status = paylineArray.includes(true) ? 1 : 0;
    const wa = 0;
    const balance = 0;

    return {
      status,
      pa: paylineArray,
      result,
      mult,
      wa,
      balance,
      palen,
    };
  }
}

export default ResultGenerator;
