import ResultGenerator from "./ResultGenerator";
import { FORCE_WIN_GAME } from "../constants";

class BankManager {
  constructor() {
    this.resultGenerator = new ResultGenerator();
    this.betID = 0;
  }

  isBetValid(state) {
    if (state.stake <= state.balance) {
      return true;
    }
  }

  placebet(state) {
    this.betID++;
    let placebetRequest = this.resultGenerator.generateResultObject(
      this.betID % FORCE_WIN_GAME === 0
    );

    console.log(`Result : ${JSON.stringify(placebetRequest.result)}`);

    // We update the response, which will update our labels
    // at the end of animations.
    placebetRequest.balance = state.balance - state.stake;

    // Check if we have winnings.
    if (placebetRequest.mult > 1) {
      // Set winnings.
      placebetRequest.wa = state.stake * placebetRequest.mult;
    }

    return placebetRequest;
  }
}

export const bankManagerInstance = new BankManager();
export default bankManagerInstance;
