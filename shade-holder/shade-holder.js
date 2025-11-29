"use strict"
const jscad = require('@jscad/modeling')
const { union } = jscad.booleans
const { sphere, cuboid } = jscad.primitives
import { cylinder } from "https://raw.githubusercontent.com/jbroll/jscad-models/refs/heads/main/utils/index.js"
const { degToRad } = jscad.utils;
const rad = degToRad;
const { translate, rotateX, rotateZ } = require('@jscad/modeling').transforms


function main() {
  const outer = 42/2;
  const inner = 37/2;
  const height = 40;
  const coneRadius = 52/2;
  const coneHeight = 8;

  return rotateX(rad(0),
    translate([0, 0, 0], union(
      cylinder({ outer, inner, height, segments: 128 }),
      cylinder({ outer: [inner, coneRadius], inner, segments: 128, 
                 height: coneHeight, 
                 center: [0, 0, height/2- coneHeight/2]}),
      
    ))
  )
}

module.exports = { main }
