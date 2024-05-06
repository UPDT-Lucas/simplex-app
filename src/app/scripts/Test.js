"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simplex_big_m_1 = require("./simplex-big-m");
var matrix = [
    [-5, 2, -1, 1, 0, 0, 'M', 0],
    [1, 4, 1, -1, 1, 0, 0, 6],
    [2, 1, 3, -3, 0, -1, 1, 2],
];
var simplexBigM = new simplex_big_m_1.default(matrix, ['z', 's4', 'a6'], ['x1', 'x2', 'x3p', 'x3pp', 's4', 's5', 'a6'], false);
simplexBigM.balanceArtificalVars();
simplexBigM.getInfo();
var i = 0;
while (!simplexBigM.checkSolved()) {
    console.log('Iteration: ', i++);
    simplexBigM.getInfo();
    // if (simplexBigM.makeIteration() == -1) {
    //   console.log('No solution');
    //   break;
    // }
    simplexBigM.makeIteration().then(function (res) {
        console.log(res);
    });
    // console.log('SOLVED?: ---------------------------------------------- ' + simplexBigM.checkSolved());
    // if(i > 3){
    //   break
    // }
}
simplexBigM.getInfo();
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
