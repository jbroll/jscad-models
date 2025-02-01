const { cylinderElliptic } = require('@jscad/modeling').primitives
const { subtract } = require('@jscad/modeling').booleans

const TAU = Math.PI * 2
const DEFAULT_OPTIONS = {
    height: 1,
    segments: 32,
    center: [0, 0, 0],
    angle: [0, TAU]
}

/**
 * Normalizes radius input into [startRadius, endRadius] format
 * @param {Number|Array} radius - Single value, [start, end], or [[x1,y1], [x2,y2]]
 * @param {Number} defaultValue - Fallback value if radius is undefined
 * @returns {[Array, Array]} Normalized start and end radii
 */
const normalizeRadius = (radius, defaultValue = 1) => {
    if (!radius) return [[defaultValue, defaultValue], [defaultValue, defaultValue]]
    if (!Array.isArray(radius)) return [[radius, radius], [radius, radius]]
    
    const [start, end] = radius
    return [
        Array.isArray(start) ? start : [start, start],
        Array.isArray(end) ? end : [end, end]
    ]
}

/**
 * Returns a solid or hollow cylinder with optional elliptical cross-sections
 * @param {Object} options - Cylinder configuration
 * @param {Number|Array} [options.radius] - Outer radius for solid cylinder
 * @param {Number|Array} [options.outer] - Outer radius for hollow cylinder
 * @param {Number|Array} [options.inner] - Inner radius for hollow cylinder
 * @param {Number|Array} [options.wall] - Wall thickness for pipe
 * @param {Array} [options.angle] - [start, end] angles in radians
 * @param {Number} [options.height] - Cylinder height
 * @param {Number} [options.segments] - Number of segments
 * @param {Array} [options.center] - Center position [x,y,z]
 * @returns {Object} JSCAD geometry object
 */
const cylinder = (options = {}) => {
    // Ensure angle values are properly passed through from options
    const config = { ...DEFAULT_OPTIONS, ...options }
    const { startAngle, endAngle } = config.angle ? 
        { startAngle: config.angle[0], endAngle: config.angle[1] } : 
        { startAngle: 0, endAngle: TAU }
    
    // Handle different cylinder types based on provided parameters
    if (options.wall !== undefined) {
        const [outerStart, outerEnd] = normalizeRadius(options.outer)
        const [wallStart, wallEnd] = normalizeRadius(options.wall, options.outer * 0.2 || 0.2)
        
        options.inner = [
            outerStart.map((r, i) => r - wallStart[i]),
            outerEnd.map((r, i) => r - wallEnd[i])
        ]
    }
    
    if (options.inner !== undefined) {
        const outer = cylinderElliptic({
            ...config,
            startRadius: normalizeRadius(options.outer || options.radius)[0],
            endRadius: normalizeRadius(options.outer || options.radius)[1],
            startAngle,
            endAngle
        })
        
        const inner = cylinderElliptic({
            ...config,
            startRadius: normalizeRadius(options.inner, (options.outer || options.radius) * 0.8)[0],
            endRadius: normalizeRadius(options.inner, (options.outer || options.radius) * 0.8)[1],
            startAngle,
            endAngle
        })
        
        return subtract(outer, inner)
    }
    
    // Simple solid cylinder
    const [startRadius, endRadius] = normalizeRadius(options.radius)
    return cylinderElliptic({ ...config, startRadius, endRadius, startAngle, endAngle })
}

const main = () => {
    const examples = [
        {
            name: 'Solid Cylinders',
            y: 25,
            shapes: [
                { radius: 5, caption: 'Uniform' },
                { radius: [5, 3], caption: 'Tapered' },
                { radius: [[5, 3], [5, 3]], caption: 'Elliptical' },
                { radius: 5, angle: [0, TAU/4], caption: 'Partial' }
            ]
        },
        {
            name: 'Hollow Cylinders',
            y: 0,
            shapes: [
                { outer: 6, inner: 4, caption: 'Uniform' },
                { outer: [6, 4], inner: [4, 2.5], caption: 'Tapered' },
                { outer: [[6, 4], [6, 4]], inner: [[4, 2.5], [4, 2.5]], caption: 'Elliptical' },
                { outer: 6, inner: 4, angle: [0, TAU/2], caption: 'Partial' }
            ]
        },
        {
            name: 'Pipes',
            y: -25,
            shapes: [
                { outer: 6, wall: 1, caption: 'Uniform' },
                { outer: [6, 4], wall: [1, 0.8], caption: 'Tapered' },
                { outer: [[6, 4], [6, 4]], wall: [[1.5, 0.5], [1.5, 0.5]], caption: 'Variable' },
                { outer: 6, wall: 1, angle: [0, TAU*3/4], caption: 'Partial' }
            ]
        }
    ]

    return examples.flatMap(({shapes, y}, groupIndex) => 
        shapes.map((shape, index) => cylinder({
            ...shape,
            height: 10,
            center: [index * 20 - 20, y, 0]
        }))
    )
}

module.exports = { cylinder, main }
