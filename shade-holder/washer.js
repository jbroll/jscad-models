"use strict"
const jscad = require('@jscad/modeling')
const { subtract, union } = jscad.booleans
const { sphere, cuboid } = jscad.primitives
import { cylinder } from "https://raw.githubusercontent.com/jbroll/jscad-models/refs/heads/main/utils/index.js"
const { degToRad } = jscad.utils;
const rad = degToRad;
const { translate, rotateX, rotateZ } = require('@jscad/modeling').transforms


function main() {
  const hole = 7;
  const squareSide = 11;
  const squareDepth = 3;
  const wellDia = 12;
  const wellDepth = 2;
  const washerDia = 25;

  const wall = 1;

  return subtract(
    union(
      cylinder({ outer: washerDia/2, inner: wellDia/2, segments: 128,
                 height: 1.75 }),
      cylinder({ radius: washerDia/2, segments: 128,
                 height: 0.5,
                 center: [0, 0, -1.75/2] }),
      cuboid({ size: [squareSide, squareSide, squareDepth],
             center: [0, 0, -2]})
      ),
      cylinder({ radius: hole/2, height: 7 })
  )
}

module.exports = { main }
