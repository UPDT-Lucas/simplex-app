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
import SimplexBigM from './simplex-big-m';

type MatrixValue = string | number;
type Matrix = MatrixValue[][];
let matrix: Matrix = [
    [-2, 1, 0, 0, 'M', 0],
    [1, 1, 1, 0, 0, 3],
    [-1, 1, 0, -1, 1, 1]
];

const simplexBigM = new SimplexBigM(matrix, ["z", "s3", "a5"], ["x1", "x2", "s3", "s4","a5"], false);

simplexBigM.getInfo();
simplexBigM.balanceArtificalVars();
simplexBigM.getInfo();
console.log('-----------------------------------------------------')
simplexBigM.makeIteration();
console.log(simplexBigM.checkSolved());
simplexBigM.getInfo(); 
console.log('-----------------------------------------------------')
simplexBigM.makeIteration();
simplexBigM.getInfo(); 
console.log(simplexBigM.checkSolved());
console.log(simplexBigM.getSolution());