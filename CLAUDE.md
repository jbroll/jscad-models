# JSCAD Models Coding Guidelines

When working on JSCAD models in this repository, follow these coding practices:

## Parameter Definitions

Use the hierarchical parameter system for creating UI controls.

Reference: https://raw.githubusercontent.com/jbroll/jscadui/hierarchical-params/apps/jscad-web/llm.txt

## JSCAD API

Use the jscad-fluent API for creating geometry. This provides a chainable, fluent interface.

Reference: https://raw.githubusercontent.com/jbroll/jscad-fluent/main/llm.txt

## Quick Reference

- Import fluent API: `import { jf } from 'jscad-fluent'`
- Angles are in RADIANS (use `Math.PI`)
- Colors use 0-1 range (not 0-255)
- Parameters use proxy assignment: `params.radius = 5`
- Use `params._type = 'Name'` for UI section labels
