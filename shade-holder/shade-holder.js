"use strict"
const jscad = require('@jscad/modeling')
const { union } = jscad.booleans
const { sphere, cuboid } = jscad.primitives
const { thread, getThreadSpecsFromTable } = require("jscad-threadlib");
import { cylinder } from "https://raw.githubusercontent.com/jbroll/jscad-models/refs/heads/main/utils/index.js"
const { degToRad } = jscad.utils;
const rad = degToRad;
const { translate, rotateX, rotateZ } = require('@jscad/modeling').transforms


function main() {
  const threadHeight = 15;
  const linkHeight = 15;
  const ringHeight = 6;

  const wall = 1;

  const threads_ext = "M42x4-ext";

  const [pitch, _rot, diameter_ext] = getThreadSpecsFromTable(threads_ext);
  const turns = threadHeight / pitch;

  const ringOuter = 46;

  return rotateX(rad(180),
    translate([0, 0, 0], union(
      thread({ thread: threads_ext, turns }),
      cylinder({ outer: diameter_ext/2 - .25, wall, height: pitch * turns + 3, segments: 128 }),
      cylinder({ 
        outer: [42/2-.9, 42/2-.9], 
        wall: 2, 
        height: linkHeight,
        segments: 128,
        center: [0, 0, -15] }),
      cylinder({outer: ringOuter/2, wall: 4, height: 8, center: [0, 0, -18.5]}),
      [0, 120, 240].map(a =>
        cylinder({
          segments: 128,
          outer: [ringOuter/2 + 2.5, ringOuter/2 - 3], 
          inner: [ringOuter/2 - 4, ringOuter/2 - 4], 
          height: ringHeight,
          angle: [rad(a+0.0), rad(a+10.0)],
          center: [0, 0, -19.5]})
      )    
    ))
  )
}

module.exports = { main }
