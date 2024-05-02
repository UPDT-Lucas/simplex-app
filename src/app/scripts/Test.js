"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
import Simplex from './simplex';
let matrix: number[][] = [
    [0, 0, 0, 0, 0, 1, 1, 0],
    [-1, -2, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, -1, 0, 1, 0, 1],
    [-1, 1, 0, 0, -1, 0, 1, 3],
    [0, 1, 1, 0, 0, 0, 0, 5]
];

const simplex = new Simplex(matrix, ["-w", "z", "a6", "a7", "s3"], ["x1", "x2", "s3", "s4", "s5", "a6", "a7"], true);

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
const solution = simplex.getSolution();
console.log(solution);
*/
var simplex_big_m_1 = require("./simplex-big-m");
var matrix = [
    [-1, -2, 0, 0, 0, 'M', 'M', 0],
    [1, 1, 0, -1, 0, 1, 0, 1],
    [-1, 1, 0, 0, -1, 0, 1, 3],
    [0, 1, 1, 0, 0, 0, 0, 5]
];
var simplexBigM = new simplex_big_m_1.default(matrix, ["z", "a6", "a7", "s3"], ["x1", "x2", "s3", "s4", "s5", "a6", "a7"], false);
simplexBigM.getInfo();
console.log("Is a correct initial matrix: " + simplexBigM.verifyArtificalM());
