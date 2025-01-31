"use strict"

const jscad = require('@jscad/modeling')
const { arc, circle, ellipse, line, polygon, rectangle, roundedRectangle, square, star } = jscad.primitives
const { cube, cuboid, cylinder, cylinderElliptic, ellipsoid, geodesicSphere, roundedCuboid, roundedCylinder, sphere, torus } = jscad.primitives
const { translate, rotateZ,rotateX, rotateY  } = require('@jscad/modeling').transforms
const { intersect, subtract, union } = jscad.booleans;
const { degToRad } = jscad.utils;
const { hull, hullChain, hullPoints2, hullPoints3 } = jscad.hulls;

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
    const startRad = degToRad(start);
    const endRad = degToRad(end);
    const angleStep = (endRad - startRad) / (count - 1);
  
    let angles;
    if ( count === 1 ) {
      angles = [startRad];
    } else {
      angles = iota(count).map(i => startRad + (i * angleStep));
    }
    const radiusX = width / 2;
    const radiusY = height / 2;

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


function cycl(outer, wall, height) {
    return subtract(cylinder({ height: height, radius: outer/2, segments: 64 }),
                    cylinder({ height: height, radius: outer/2 - wall, segments: 64 }));
}

function cone(outer1, outer2, wall, height) {
  const radius11 = outer1/2;
  const radius12 = outer2/2;
  const radius21 = outer1/2 - wall;
  const radius22 = outer2/2 - wall;
  
  return subtract(
    cylinderElliptic({
      height: height, 
      startRadius: [radius11,radius11], 
      endRadius: [radius12,radius12],
      segments: 64
    }),
    cylinderElliptic({
      height: height, 
      startRadius: [radius21,radius21], 
      endRadius: [radius22,radius22],
      segments: 64
    })
  )
}
function main() {
  const wall = 2

  const ringOuter = 46;
  const ringHeight = 9;

  const linkOuter = 42;
  const linkHeight = 12.5;
  
  const coneUpper = 57;
  const coneLower = 42;
  const coneHeight = 10;

  const linkConeOverlap = 2;
  const fillHeight = 3;

  const rStart = 20;
  const rEnd = 100;
  const arch1 = 
    createRotatedPlacement({
          count: 10,
          radius: (ringOuter - wall - wall/2)/2,
          rotate: true,
          start:rStart, end: rEnd, 
        }, union(
          rotateY(degToRad(90), cylinder({ radius: 5, height: 10 })
        )));
  const archTop = 
    translate([0, 0, -7], createRotatedPlacement({
          count: 1,
          radius: (ringOuter - wall - wall/2)/2,
          rotate: true,
          start: 60, end: 60, 
        }, union(
          rotateY(degToRad(90), cylinder({ radius: 5, height: 10 })
        ))));
  
  const archFull = hull(
    hullChain(translate([0, 0, -(linkHeight + 2.5)], arch1)),
    archTop
  );
  const arch = createRotatedPlacement({
        count: 3,
        start: 0,
        end: 240,
        radius: 0,
        rotate: true
    },                                    
    archFull
  );
  return union(
    translate([0, 0, coneHeight/2], 
              cone(coneLower, coneUpper, wall, coneHeight)),
    subtract(
      translate([0, 0, -(linkHeight/2 + linkConeOverlap/2)], 
              cycl(linkOuter, wall, linkHeight + linkConeOverlap)
      ), arch
    ),
    //translate([0, 0, -(0 + linkHeight + fillHeight)], cone(ringOuter, linkOuter, wall, fillHeight)),
    //translate([0, 0, -(linkHeight + ringHeight/2)],
    //          cycl(ringOuter, wall, ringHeight)),
    translate([0, 0, -11.5],
      createRotatedPlacement({
        count: 3,
        start: 0,
        end: 240,
        radius: (ringOuter - wall - wall/2)/2,
        rotate: true
      }, union(
        translate([0, 0, 0],sphere({radius: wall/2+1.5}))
      ))
    )
  );
}

module.exports = { main }
