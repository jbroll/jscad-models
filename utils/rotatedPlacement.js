const { utils, transforms } = require('@jscad/modeling');
const { degToRad } = utils;
const { translate, rotateZ } = transforms;

/**
 * Creates an array of numbers with given length, start value and step
 * @param {number} n - Length of the array
 * @param {number} [start=0] - Starting value
 * @param {number} [step=1] - Step between values
 * @returns {number[]} Array of numbers
 * @throws {Error} If n is negative or not an integer
 */
function iota(n, start = 0, step = 1) {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error('Length must be a non-negative integer');
    }
    return Array.from({ length: n }, (_, i) => start + (i * step));
}

/**
 * Configuration options for rotated placement
 * @typedef {Object} RotatedPlacementOptions
 * @property {number} [count=16] - Number of items to place
 * @property {number} [radius] - Radius for circular placement (overrides width/height)
 * @property {number} [width=20] - Width of the ellipse
 * @property {number} [height=20] - Height of the ellipse
 * @property {number} [start=0] - Start angle in degrees
 * @property {number} [end=360] - End angle in degrees
 * @property {boolean} [rotate=false] - Whether to rotate items to match their position
 */

/**
 * Places and optionally rotates shapes in a circular or elliptical pattern
 * @param {RotatedPlacementOptions} options - Configuration options
 * @param {Object} shape - The JSCAD shape to place
 * @returns {Object[]} Array of transformed shapes
 * @throws {Error} If invalid options are provided
 */
function rotatedPlacement(options, shape) {
    if (!shape) {
        throw new Error('Shape parameter is required');
    }

    // Validate and normalize options
    const {
        count = 16,
        radius = null,
        width = 20,
        height = 20,
        start = 0,
        end = 360,
        rotate = false
    } = options;

    // Input validation
    if (!Number.isInteger(count) || count < 1) {
        throw new Error('Count must be a positive integer');
    }
    if (start >= end) {
        throw new Error('Start angle must be less than end angle');
    }

    // Calculate dimensions
    const finalWidth = radius !== null ? radius * 2 : width;
    const finalHeight = radius !== null ? radius * 2 : height;
    if (finalWidth <= 0 || finalHeight <= 0) {
        throw new Error('Invalid dimensions: width and height must be positive');
    }

    // Convert angles to radians
    const startRad = degToRad(start);
    const endRad = degToRad(end);

    // Calculate angles array
    const angles = count === 1 
        ? [startRad]
        : iota(count).map(i => startRad + (i * (endRad - startRad) / (count - 1)));

    // Calculate radii
    const radiusX = finalWidth / 2;
    const radiusY = finalHeight / 2;

    // Perform transformations
    return angles.map(angle => {
        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle);
        
        // Apply transformations
        const rotated = rotate ? rotateZ(angle, shape) : shape;
        return translate([x, y, 0], rotated);
    });
}

module.exports = {
    iota,
    rotatedPlacement
};