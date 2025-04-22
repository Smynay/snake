/**
 * Returns the random int between min and max (include)
 * @param min {number}
 * @param max {number}
 * @returns {number}
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns promise with passed time to resolve
 * @param ms {number}
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Returns the array with passed size
 * @param size {number}
 * @returns {number[]}
 */
export function getArrayBySize(size) {
  if (!size || size < 0) {
    return [];
  }

  return [...Array(size).keys()];
}
