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
var simplex = new simplex_1.default(matrix, ["-w", "z", "a6", "a7", "s3"], ["x1", "x2", "s3", "s4", "s5", "a6", "a7"], true);
simplex.getInfo();
simplex.balanceArtificalVars();
simplex.getInfo();
simplex.makeFaseOneIteration();
simplex.getInfo();
simplex.prepareFaseTwo();
simplex.getInfo();
simplex.makeFaseTwoIteration();
simplex.getInfo();
simplex.makeFaseTwoIteration();
simplex.getInfo();
var solution = simplex.getSolution();
console.log(solution);
/*
import SimplexBigM from './simplex-big-m';
import Simplex from './simplex';
type MatrixValue = string | number;
type Matrix = MatrixValue[][];
let matrix: Matrix = [
    [-1, -2, 0, 0, 0, 'M', 'M', 0],
    [1, 1, 0, -1, 0, 1, 0, 1],
    [-1, 1, 0, 0, -1, 0, 1, 3],
    [0, 1, 1, 0, 0, 0, 0, 5]
];

const simplexBigM = new SimplexBigM(matrix, ["z", "a6", "a7", "s3"], ["x1", "x2", "s3", "s4","s5", "a6", "a7"], false);

simplexBigM.getInfo();
console.log ("Is a correct initial matrix: " + simplexBigM.verifyArtificalM());
*/
