import { InputController } from "./InputController.js";
import { getRandomInt, sleep } from "./utils.js";
import { OutputController } from "./OutputController.js";

export class Game {
  GAME_SPEED = 300;
  FIELD_SIZE = 10;
  COMMANDS_EXCEPTIONS_BY_COMMANDS = {
    up: "down",
    left: "right",
    down: "up",
    right: "left",
  };
  isGameEnded = false;
  isGameStarted = false;
  reason = "error";
  command = "right";
  executedCommand = "right";
  inputController;
  outputController;
  snakePartsCoords;
  foodCoords;

  constructor() {
    this.inputController = new InputController(this.setCommand.bind(this));
    this.outputController = new OutputController(this.FIELD_SIZE);
    this.snakePartsCoords = [this.getRandomSnakePosition()];
    this.foodCoords = [this.getRandomFoodPosition()];
  }

  async start() {
    this.render();

    while (!this.isGameEnded) {
      this.processInput();

      if (this.isGameStarted) {
        this.update();
        this.render();
      }

      await sleep(this.GAME_SPEED);
    }
  }

  processInput() {
    if (
      this.command ===
      this.COMMANDS_EXCEPTIONS_BY_COMMANDS[this.executedCommand]
    ) {
      this.command = this.executedCommand;
    }
  }

  update() {
    this.updateSnake();
  }

  render() {
    if (!this.isGameStarted) {
      this.outputController.drawWelcome();
      return;
    }

    if (this.isGameEnded) {
      this.outputController.drawResult(
        this.reason,
        this.snakePartsCoords.length,
      );
      return;
    }
    this.outputController.drawField(this.snakePartsCoords, this.foodCoords);
  }

  updateSnake() {
    const newHeadPosition = this.getNewHeadCoords();

    if (this.checkOutOfField(...newHeadPosition)) {
      this.setGameEnd("out of field");
      return;
    }

    const talePosition = this.snakePartsCoords[0];

    if (!this.checkOnFood(...talePosition)) {
      this.snakePartsCoords.shift();
    } else {
      this.foodCoords = [this.getRandomPosition()];
    }

    if (this.checkOnSnake(...newHeadPosition)) {
      this.setGameEnd("self harm");
      return;
    }

    this.snakePartsCoords.push(newHeadPosition);
  }

  getNewHeadCoords() {
    this.executedCommand = this.command;
    const currentHeadPosition = this.getCurrentHeadPosition();

    switch (this.command) {
      case "up":
        return [currentHeadPosition[0], currentHeadPosition[1] - 1];

      case "left":
        return [currentHeadPosition[0] - 1, currentHeadPosition[1]];

      case "down":
        return [currentHeadPosition[0], currentHeadPosition[1] + 1];

      case "right":
        return [currentHeadPosition[0] + 1, currentHeadPosition[1]];

      default:
        throw new Error("no command");
    }
  }

  getCurrentHeadPosition() {
    if (this.snakePartsCoords.length === 1) {
      return this.snakePartsCoords[0];
    }

    return this.snakePartsCoords[this.snakePartsCoords.length - 1];
  }

  checkOutOfField(x, y) {
    if (x < 0 || x > this.FIELD_SIZE - 1) {
      return true;
    }

    return y < 0 || y > this.FIELD_SIZE - 1;
  }

  checkOnFood(x, y) {
    return Boolean(
      this.foodCoords.find(([foodX, foodY]) => foodX === x && foodY === y),
    );
  }

  checkOnSnake(x, y) {
    return Boolean(
      this.snakePartsCoords.find(
        ([partX, partY]) => partX === x && partY === y,
      ),
    );
  }

  getRandomPosition() {
    return [
      getRandomInt(0, this.FIELD_SIZE - 1),
      getRandomInt(0, this.FIELD_SIZE - 1),
    ];
  }

  getRandomSnakePosition() {
    return [
      getRandomInt(3, this.FIELD_SIZE - 4),
      getRandomInt(3, this.FIELD_SIZE - 4),
    ];
  }

  getRandomFoodPosition() {
    let coords = this.getRandomPosition();

    while (!this.checkOnSnake(...coords)) {
      coords = this.getRandomPosition();
    }

    return this.checkOnSnake(...coords) ? this.getRandomPosition() : coords;
  }

  setCommand(name) {
    this.command = name;
    this.isGameStarted = true;
  }

  setGameEnd(reason) {
    this.isGameEnded = true;
    this.reason = reason;
  }
}
