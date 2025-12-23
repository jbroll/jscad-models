const jf = require('@jbroll/jscad-fluent')

function defineParams(params) {
    params.standoff._type = 'Standoff'
    params.standoff.height = { default: 8, min: 2, max: 30, step: 0.5, label: 'Height' }
    params.standoff.radius = { default: 4, min: 2, max: 15, step: 0.5, label: 'Radius' }

    params.standoff._type = 'Post Tip'
    params.standoff.postRadius = { default: 1.5, min: 0.5, max: 5, step: 0.1, label: 'Post Radius' }
    params.standoff.postHeight = { default: 3, min: 1, max: 10, step: 0.5, label: 'Post Height' }
    params.standoff.splitWidth = { default: 0.8, min: 0.3, max: 2, step: 0.1, label: 'Split Width' }
    params.standoff.splitDepth = { default: 2, min: 0.5, max: 8, step: 0.5, label: 'Split Depth' }
}

function createStandoff(p) {
    // Main standoff body
    const body = jf.cylinder({
        radius: p.radius,
        height: p.height
    }).translateZ(p.height / 2)

    // Post tip that goes through PCB hole
    const post = jf.cylinder({
        radius: p.postRadius,
        height: p.postHeight
    }).translateZ(p.height + p.postHeight / 2)

    // Rounded top on the post (slightly wider for snap fit)
    const topRadius = p.postRadius * 1.2
    const top = jf.sphere({
        radius: topRadius,
        segments: 16
    }).translateZ(p.height + p.postHeight)

    // Split slot through the post tip (allows flex for snap-fit)
    const splitHeight = p.splitDepth + topRadius
    const split = jf.cuboid({
        size: [p.splitWidth, p.postRadius * 3, splitHeight]
    }).translateZ(p.height + p.postHeight - p.splitDepth / 2 + topRadius / 2)

    // Combine body, post, and top, then subtract the split
    return body.union(post, top).subtract(split)
}

// Standalone main for direct use
function main(params) {
    defineParams(params)
    return createStandoff(params.standoff)
}

module.exports = { main, createStandoff, defineParams }
