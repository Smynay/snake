import { getArrayBySize } from "./utils.js";

export class OutputController {
  HORIZONTAL_BORDER_SYMBOL = "───";
  VERTICAL_BORDER_SYBMOL = "┆";
  CORNER_BORDER_SYMBOL = "★";
  EMPTY_SYMBOL = "   ";
  SNAKE_SYMBOL = " ▩ ";
  SNAKE_HEAD_SYMBOL = " ▩ ";
  SNAKE_TALE_SYMBOL = " ▩ ";
  FOOD_SYMBOL = " ▪ ";
  HORIZONTAL_CEIL_SIZE = 3;
  ALLOW_BORDERS = true;
  DEBUG_MODE = false;

  size;

  /**
   * Returns the game field size with borders
   * @returns {number}
   */
  get sizeWithBorder() {
    return this.size + 2;
  }
  constructor(size) {
    this.size = size;
  }

  /**
   * Draw the game field
   * @param snakePartsCoords {([x, y])[]}
   * @param foodCoords {([x, y])[]}
   * @returns {void}
   */
  drawField(snakePartsCoords, foodCoords) {
    const output = getArrayBySize(this.size).map((nil, y) =>
      this.getLineByParams(y, snakePartsCoords, foodCoords),
    );

    this.draw(output);
  }

  /**
   * Returns the line of game field
   * @param y {number} - line index
   * @param snakePartsCoords {([x, y])[]}
   * @param foodCoords {([x, y])[]}
   * @returns {string}
   */
  getLineByParams(y, snakePartsCoords, foodCoords) {
    return getArrayBySize(this.size)
      .map((nil, x) =>
        this.getSymbolByCoords(x, y, snakePartsCoords, foodCoords),
      )
      .join("");
  }

  /**
   * Returns the symbol for current ceil position
   * @param x {number}
   * @param y {number}
   * @param snakePartsCoords {([x, y])[]}
   * @param foodCoords {([x, y])[]}
   * @returns {string}
   */
  getSymbolByCoords(x, y, snakePartsCoords, foodCoords) {
    const snakePartIndex = snakePartsCoords.findIndex(
      (coords) => coords[0] === x && coords[1] === y,
    );
    const isSnakeHead = snakePartIndex === snakePartsCoords.length - 1;
    const isSnakeTale = snakePartIndex === 0;

    if (isSnakeHead) {
      return this.SNAKE_HEAD_SYMBOL;
    }

    if (isSnakeTale) {
      return this.SNAKE_TALE_SYMBOL;
    }

    if (snakePartIndex > -1) {
      return this.SNAKE_SYMBOL;
    }

    const isFoodCoords = foodCoords.find(
      (coords) => coords[0] === x && coords[1] === y,
    );

    if (isFoodCoords) {
      return this.FOOD_SYMBOL;
    }

    return this.EMPTY_SYMBOL;
  }

  /**
   * Returns centred text line or correct empty line
   * @param text {string | undefined}
   * @returns {string}
   */
  getTextLine(text) {
    if (!text || !text.length) {
      return getArrayBySize(this.size)
        .map(() => this.EMPTY_SYMBOL)
        .join("");
    }

    if (text.length === this.size) {
      return text;
    }

    const paddingSize =
      (this.size * this.HORIZONTAL_CEIL_SIZE - text?.length) / 2;

    const leftPaddingSize = Math.floor(paddingSize);
    const rightPaddingSize = Math.ceil(paddingSize);

    const leftPadding = getArrayBySize(leftPaddingSize)
      .map(() => " ")
      .join("");
    const rightPadding = getArrayBySize(rightPaddingSize)
      .map(() => " ")
      .join("");

    return [leftPadding, text, rightPadding].join("");
  }

  /**
   * Draws the welcome screen
   * @returns {void}
   */
  drawWelcome() {
    const output = [
      this.getTextLine(),
      this.getTextLine("Welcome to SNAKE game"),
      this.getTextLine(),
      this.getTextLine(),
      this.getTextLine(),
      this.getTextLine("Press WASD to start"),
    ];

    this.draw(output);
  }

  /**
   * Draws the game result screen
   * @param reason {string}
   * @param score {number}
   * @returns {void}
   */
  drawResult(reason, score) {
    const output = [
      this.getTextLine(),
      this.getTextLine("GAME OVER"),
      this.getTextLine(),
      this.getTextLine(),
      this.getTextLine(`Your score: ${score}`),
      this.getTextLine(),
      this.getTextLine(),
      this.getTextLine(`Reason: ${reason}`),
    ];

    this.draw(output);
  }

  /**
   * Prepares and draws the square screen by lines
   * @param lines {string[]}
   * @returns {void}
   */
  draw(lines) {
    let output = [...lines];

    if (output.length < this.size) {
      const missedLinesCount = this.size - output.length;
      const missedLines = getArrayBySize(missedLinesCount).map(() =>
        this.getTextLine(),
      );

      output.push(...missedLines);
    }

    if (output.length > this.size) {
      output = output.slice(0, this.size);
    }

    if (this.ALLOW_BORDERS) {
      output = this.decorateByBorders(output);
    }

    if (!this.DEBUG_MODE) {
      console.clear();
    }

    console.log(output.join("\n"));
  }

  /**
   * Adds horizontal borders and border symbols to each line
   * @param lines {string[]}
   * @returns {string[]}
   */
  decorateByBorders(lines) {
    const borderLine = this.getHorizontalBorderLine();

    const borderedField = lines.map(
      (row) =>
        `${this.VERTICAL_BORDER_SYBMOL}${row}${this.VERTICAL_BORDER_SYBMOL}`,
    );

    return [borderLine, ...borderedField, borderLine];
  }

  /**
   * Returns horizontal border line
   * @returns {string}
   */
  getHorizontalBorderLine() {
    return getArrayBySize(this.sizeWithBorder)
      .map((nil, i) => {
        if (i === 0 || i === this.sizeWithBorder - 1) {
          return this.CORNER_BORDER_SYMBOL;
        }

        return this.HORIZONTAL_BORDER_SYMBOL;
      })
      .join("");
  }
}
