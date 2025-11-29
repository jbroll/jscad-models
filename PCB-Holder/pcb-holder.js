const jf = require('@jbroll/jscad-fluent')

function main(params) {
    params._type = 'PCB Dimensions'
    params.pcbWidth = { default: 50, min: 10, max: 200, step: 1, label: 'PCB Width' }
    params.pcbLength = { default: 70, min: 10, max: 200, step: 1, label: 'PCB Length' }
    params.holeInset = { default: 3, min: 1, max: 20, step: 0.5, label: 'Hole Inset from Edge' }

    params._type = 'Standoff'
    params.standoffHeight = { default: 8, min: 2, max: 30, step: 0.5, label: 'Standoff Height' }
    params.standoffRadius = { default: 4, min: 2, max: 15, step: 0.5, label: 'Standoff Radius' }

    params._type = 'Post Tip'
    params.postRadius = { default: 1.5, min: 0.5, max: 5, step: 0.1, label: 'Post Radius' }
    params.postHeight = { default: 3, min: 1, max: 10, step: 0.5, label: 'Post Height' }
    params.splitWidth = { default: 0.8, min: 0.3, max: 2, step: 0.1, label: 'Split Width' }
    params.splitDepth = { default: 2, min: 0.5, max: 8, step: 0.5, label: 'Split Depth' }

    params._type = 'Base Plate'
    params.basePlate = { default: true, label: 'Include Base Plate' }
    params.baseThickness = { default: 2, min: 1, max: 5, step: 0.5, label: 'Base Thickness' }

    // Create a single standoff with split-top post
    const standoff = createStandoff(params)

    // Calculate corner positions
    const halfWidth = (params.pcbWidth - 2 * params.holeInset) / 2
    const halfLength = (params.pcbLength - 2 * params.holeInset) / 2

    // Place standoffs at four corners
    const standoffs = jf.union(
        standoff.translate([halfWidth, halfLength, 0]),
        standoff.translate([-halfWidth, halfLength, 0]),
        standoff.translate([-halfWidth, -halfLength, 0]),
        standoff.translate([halfWidth, -halfLength, 0])
    )

    if (params.basePlate) {
        const base = jf.roundedRectangle({
            size: [params.pcbWidth, params.pcbLength],
            roundRadius: 2,
            segments: 16
        }).extrudeLinear({ height: params.baseThickness })

        return standoffs.translateZ(params.baseThickness).union(base)
    }

    return standoffs
}

function createStandoff(params) {
    // Main standoff body
    const body = jf.cylinder({
        radius: params.standoffRadius,
        height: params.standoffHeight
    }).translateZ(params.standoffHeight / 2)

    // Post tip that goes through PCB hole
    const post = jf.cylinder({
        radius: params.postRadius,
        height: params.postHeight
    }).translateZ(params.standoffHeight + params.postHeight / 2)

    // Rounded top on the post (slightly wider for snap fit)
    const topRadius = params.postRadius * 1.2
    const top = jf.sphere({
        radius: topRadius,
        segments: 16
    }).translateZ(params.standoffHeight + params.postHeight)

    // Split slot through the post tip (allows flex for snap-fit)
    const splitHeight = params.splitDepth + topRadius
    const split = jf.cuboid({
        size: [params.splitWidth, params.postRadius * 3, splitHeight]
    }).translateZ(params.standoffHeight + params.postHeight - params.splitDepth / 2 + topRadius / 2)

    // Combine body, post, and top, then subtract the split
    return body.union(post, top).subtract(split)
}

module.exports = { main }
