import readline from "readline";
import process from "process";

export class InputController {
  UP_KEY_NAME = "w";
  LEFT_KEY_NAME = "a";
  DOWN_KEY_NAME = "s";
  RIGHT_KEY_NAME = "d";
  COMMANDS_BY_KEYS = {
    [this.UP_KEY_NAME]: "up",
    [this.LEFT_KEY_NAME]: "left",
    [this.DOWN_KEY_NAME]: "down",
    [this.RIGHT_KEY_NAME]: "right",
  };

  get availableKeys() {
    return [
      this.UP_KEY_NAME,
      this.LEFT_KEY_NAME,
      this.DOWN_KEY_NAME,
      this.RIGHT_KEY_NAME,
    ];
  }

  constructor(callback) {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    process.stdin.on("keypress", (chunk, key) => {
      if (key && this.availableKeys.includes(key.name)) {
        callback(this.COMMANDS_BY_KEYS[key.name]);
        return;
      }

      process.exit();
    });
  }
}
