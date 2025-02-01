const { primitives, booleans, transforms } = require('@jscad/modeling');
const { rotatedPlacement } = require('./rotated-placement');

function main() {
    // Example 1: Simple circle of cubes
    const basicCube = primitives.cuboid({ size: [2, 2, 2] });
    const circularCubes = rotatedPlacement({
        count: 8,
        radius: 10,
        rotate: false
    }, basicCube);

    // Example 2: Rotated cylinders in an elliptical pattern
    const cylinder = primitives.cylinder({ radius: 0.5, height: 4 });
    const ellipticalCylinders = rotatedPlacement({
        count: 12,
        width: 30,
        height: 20,
        rotate: true
    }, cylinder);

    // Example 3: Partial arc of spheres
    const sphere = primitives.sphere({ radius: 1 });
    const arcSpheres = rotatedPlacement({
        count: 6,
        radius: 15,
        start: 0,
        end: 180,
        rotate: false
    }, sphere);

    // Example 4: Compound shape in a tight circle
    const compound = createCompoundShape();
    const compoundPattern = rotatedPlacement({
        count: 5,
        radius: 8,
        start: 0,
        end: 360,
        rotate: true
    }, compound);

    // Combine all examples, offsetting each along the Z axis
    const examples = [
        ...circularCubes,
        ...ellipticalCylinders.map(shape => transforms.translate([0, 0, 10], shape)),
        ...arcSpheres.map(shape => transforms.translate([0, 0, 20], shape)),
        ...compoundPattern.map(shape => transforms.translate([0, 0, 30], shape))
    ];

    return examples;
}

// Helper function to create a more complex shape
function createCompoundShape() {
    const base = primitives.cuboid({ size: [2, 2, 1] });
    const top = primitives.cylinder({ radius: 0.5, height: 2 });
    const topTranslated = transforms.translate([0, 0, 1.5], top);
    return booleans.union(base, topTranslated);
}

module.exports = { main };