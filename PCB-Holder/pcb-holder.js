const jf = require('@jbroll/jscad-fluent')
const standoff = require('./standoff')
const lego = require('https://raw.githubusercontent.com/jbroll/LEGO.js/master/lego.js')

function main(params) {
    params._type = 'Part Selection'
    params.part = {
        type: 'choice',
        default: 'assembled',
        values: ['basePlate', 'assembled', 'standoff'],
        captions: ['Base Plate', 'Assembled', 'Standoff']
    }

    params._type = 'Standoff Positions'
    params.standoffSpacingX = { default: 44, min: 5, max: 200, step: 1, label: 'X Spacing (center to center)' }
    params.standoffSpacingY = { default: 64, min: 5, max: 200, step: 1, label: 'Y Spacing (center to center)' }

    standoff.defineParams(params)

    params.base._type = 'Base Plate'
    params.base.width = { default: 6, min: 1, max: 32, step: 1, label: 'Width (studs)' }
    params.base.length = { default: 8, min: 1, max: 32, step: 1, label: 'Length (studs)' }
    params.base.type = {
        type: 'choice',
        default: 'baseplate',
        values: ['brick', 'tile', 'baseplate'],
        captions: ['Brick', 'Tile', 'Baseplate']
    }
    params.base.height = {
        type: 'choice',
        default: 1,
        values: [0.333333, 0.5, 1, 2, 3, 4, 5, 6],
        captions: ['1/3', '1/2', '1', '2', '3', '4', '5', '6']
    }
    params.base.studType = {
        type: 'choice',
        default: 'solid',
        values: ['solid', 'hollow'],
        captions: ['Solid', 'Hollow']
    }
    params.base.segments = { default: 64, min: 16, max: 128, step: 16, label: 'Segments' }

    if (params.part === 'basePlate') {
        return createBasePlate(params)
    }
    if (params.part === 'standoff') {
        return standoff.createStandoff(params.standoff)
    }

    // assembled: show all 4 standoffs with base plate
    return createAssembled(params)
}

function createBasePlate(params) {
    return lego.block({
        type: params.base.type,
        width: params.base.width,
        length: params.base.length,
        height: params.base.height,
        studType: params.base.studType,
        segments: params.base.segments
    })
}

// LEGO height constants (mm per unit)
const BASEPLATE_HEIGHT = 1.3
const BLOCK_HEIGHT = 9.6

function createAssembled(params) {
    const base = createBasePlate(params)

    // Calculate actual base height based on type
    const heightUnit = params.base.type === 'baseplate' ? BASEPLATE_HEIGHT : BLOCK_HEIGHT
    const baseHeight = params.base.height * heightUnit

    const standoffPart = standoff.createStandoff(params.standoff)

    // Half the spacing for positioning from center
    const halfX = params.standoffSpacingX / 2
    const halfY = params.standoffSpacingY / 2

    // Place standoffs at four corners, raised above base plate
    const standoffs = jf.union(
        standoffPart.translate([halfX, halfY, baseHeight]),
        standoffPart.translate([-halfX, halfY, baseHeight]),
        standoffPart.translate([-halfX, -halfY, baseHeight]),
        standoffPart.translate([halfX, -halfY, baseHeight])
    )

    return jf.union(base, standoffs)
}

module.exports = { main }
