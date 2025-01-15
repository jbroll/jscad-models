"use strict"

const jscad = require('@jscad/modeling')
const { arc, circle, ellipse, line, polygon, rectangle, roundedRectangle, square, star } = jscad.primitives
const { cube, cuboid, cylinder, cylinderElliptic, ellipsoid, geodesicSphere, roundedCuboid, roundedCylinder, sphere, torus } = jscad.primitives
const { translate, rotate, rotateZ } = require('@jscad/modeling').transforms
const { union, intersect, scission, subtract } = require('@jscad/modeling').booleans
const { hull, hullChain } = jscad.hulls

const { degToRad } = require('@jscad/modeling').utils;

function iota(n, start = 0, step = 1) {
    return Array.from({ length: n }, (_, i) => start + (i * step));
}
function createRotatedPlacement(options, shape) {
    let {
        count = 16,
        radius = null,
        width = 20,
        height = 20,
        start = 0,
        end = 360,
        rotate = false
    } = options;

    if ( radius != null ) {
      width = radius * 2;
      height = radius * 2;
    }
    // Convert angles to radians
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;
    
    // Calculate angle step
    const angleStep = (endRad - startRad) / (count - 1);
    
    // Generate array of angles
    const angles = iota(count).map(i => startRad + (i * angleStep));
    
    // Calculate radii
    const radiusX = width / 2;
    const radiusY = height / 2;
    
    // Create and transform shapes
    return angles.map(angle => {
        // Parametric equations for ellipse
        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle);

      let rotated = shape;
        if (rotate) {
            rotated = rotateZ(angle, shape);
        }
        let transformed = translate([x, y, 0], rotated);
        
        
        
        return transformed;
    });
}

const getParameterDefinitions = () => [
  { name: 'gap', initial: 120, type: 'int', caption: 'Clip Gap' },
  { name: 'radius', initial: 15, type: 'int', caption: 'Radius' }

  ];

function main({ gap, radius }) {
    const start = 90 - gap/2;
    const end = -270 + gap/2;
  
  return rotate([degToRad(-90), 0, 0], union(
    subtract(
      hull(
        translate([0, 15, 0], roundedCuboid({ size: [30, 10, 6] })),
        createRotatedPlacement({
          count: 32,
          height: 30,
          width: 55,
          },
          roundedCylinder({radius: 5, height: 6, roundRadius: 1})
          )
      ),
      [  translate([ 28, 0, 0], cylinder({radius: 1.5, height: 10})),
         translate([-28, 0, 0], cylinder({radius: 1.5, height: 10})),
         translate([ 28, 0, 4.5], cylinder({radius: 3, height: 10})), 
         translate([-28, 0, 4.5], cylinder({radius: 3, height: 10}))
      ]
    ),
    translate([0, 0, 16], 
        rotate([degToRad(90), 0, 0], 
          hullChain(
            createRotatedPlacement({
                count: 25, radius: radius, start: start, end: end
              },
              roundedCylinder({radius: 1.5, height: 40, roundRadius: 1})
            )
          )
        )
    ),
  ));
}


module.exports = { main, getParameterDefinitions }
