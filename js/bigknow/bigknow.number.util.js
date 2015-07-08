/**
 * Created by jiang on 2/27/2015.
 */
/**
 * Include start, but no end, to generate int number
 * @param start
 * @param end
 * @returns {number}
 */
function generateRandomInt(start, end) {
    return Math.floor(start + Math.random()*(end - start));
}