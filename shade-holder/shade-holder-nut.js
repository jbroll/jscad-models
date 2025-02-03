"use strict"
const jscad = require('@jscad/modeling')
const { union } = jscad.booleans
const { sphere, cuboid, roundedCuboid } = jscad.primitives
const { thread, getThreadSpecsFromTable } = require("jscad-threadlib");
import { cylinder, rotatedPlacement } from "https://raw.githubusercontent.com/jbroll/jscad-models/refs/heads/main/utils/index.js"
const { degToRad } = jscad.utils;
const rad = degToRad;
const { translate, rotateZ } = require('@jscad/modeling').transforms


function main() {
  const linkHeight = 12;
  const ringHeight = 8;

  const wall = 1;

  const threads_int = "M42x4-int";
  const threads_spec = getThreadSpecsFromTable(threads_int);
  threads_spec[1] -= .4;
  threads_spec[2] += .8;

  const turns = 2;
  const [pitch, _rot, diameter_int] = threads_spec;
  const ringOuter = 46;

  return translate([0, 0, 0], union(
      thread({ thread: threads_spec, turns }),
      cylinder({
        inner: [diameter_int/2, diameter_int/2],
        outer: [diameter_int/2 + 1, diameter_int/2 + 8],
        height: pitch * (turns + .9)
      }),
      rotatedPlacement(
        { count: 3, start: 0, end: 240, radius: ringOuter/2 + 2, rotate: true },
        roundedCuboid({size: [6, 2, 3], center: [0, 0, 6]})
     )
    ))
}

module.exports = { main }
