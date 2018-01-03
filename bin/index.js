#!/usr/bin/env node

// Provide options as a parameter or options file.
require = require("@std/esm")(module);
module.exports = require("./anon-doc-budg.js").default;
