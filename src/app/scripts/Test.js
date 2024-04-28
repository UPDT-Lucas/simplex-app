"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simplex_1 = require("./simplex");
var matrix = [
    [0, 0, 0, 0, 0, 1, 1, 0],
    [-1, -2, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, -1, 0, 1, 0, 1],
    [-1, 1, 0, 0, -1, 0, 1, 3],
    [0, 1, 1, 0, 0, 0, 0, 5]
];
var simplex = new simplex_1.default(matrix, ["-w", "z", "a6", "a7", "s3"], ["x1", "x2", "s3", "s4", "s5", "a6", "a7"]);
simplex.getInfo();
simplex.balanceArtificalVars();
simplex.getInfo();
simplex.makeFaseOneIteration();
simplex.getInfo();
simplex.prepareFaseTwo();
simplex.getInfo();
simplex.makeFaseTwoIteration();
simplex.getInfo();
