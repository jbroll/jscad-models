const standoff = require('./standoff')
const pcbHolder = require('./pcb-holder')

// Mock params object that simulates the hierarchical parameter system
function createMockParams() {
    const params = {}

    return new Proxy(params, {
        set(target, prop, value) {
            if (prop === '_type') {
                return true
            }
            if (typeof value === 'object' && value !== null && 'default' in value) {
                target[prop] = value.default
            } else {
                target[prop] = value
            }
            return true
        },
        get(target, prop) {
            // Auto-create nested proxy on access (like jscad-ui does)
            if (!(prop in target)) {
                target[prop] = createMockParams()
            }
            return target[prop]
        }
    })
}

console.log('=== Testing Standoff Module ===')
const standoffParams = createMockParams()
standoff.defineParams(standoffParams)
console.log('Standoff params after defineParams:')
console.log('  standoff.height:', standoffParams.standoff.height)
console.log('  standoff.radius:', standoffParams.standoff.radius)
console.log('  standoff.postRadius:', standoffParams.standoff.postRadius)

const standoffGeom = standoff.createStandoff(standoffParams.standoff)
console.log('  createStandoff() returned:', standoffGeom)
console.log('  Has polygons:', standoffGeom?.polygons?.length > 0 || standoffGeom?.sides?.length > 0)

console.log('\n=== Testing PCB Holder Parts ===')
const parts = ['basePlate', 'standoff', 'assembled']
for (const part of parts) {
    const testParams = createMockParams()
    testParams.part = part
    const geom = pcbHolder.main(testParams)
    console.log(`\n  part="${part}":`)
    console.log('    returned:', typeof geom)
    console.log('    has geometry:', geom?.polygons?.length > 0 || geom?.sides?.length > 0 || !!geom)
}

console.log('\n=== All tests complete ===')
