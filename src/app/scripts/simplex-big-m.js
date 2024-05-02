"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Algebrite = require('algebrite');
var Math = require('mathjs');
var SimplexBigM = /** @class */ (function () {
    function SimplexBigM(matrix, basicVars, currentVars, isMin) {
        this.matrix = matrix;
        this.basicVars = basicVars;
        this.currentVars = currentVars;
        this.isMin = isMin;
    }
    SimplexBigM.prototype.getMatrix = function () {
        return this.matrix;
    };
    SimplexBigM.prototype.verifyArtificalM = function () {
        for (var i = 0; i < this.currentVars.length; i++) {
            if ((this.currentVars[i].charAt(0) === "a") && this.matrix[0][i] !== 'M') {
                return false;
            }
        }
        return true;
    };
    SimplexBigM.prototype.balanceArtificalVars = function () {
        for (var i = 0; i < this.currentVars.length; i++) {
            if (this.currentVars[i].charAt(0) === "a") {
                var column = i;
                var row = -1;
                for (var j = 1; j < this.matrix.length; j++) {
                    if (this.matrix[j][column] === 1) {
                        if (row === -1) {
                            row = j;
                        }
                        else {
                            row = -1;
                            break;
                        }
                    }
                }
                if (row !== -1) {
                    this.basicVars[row] = this.currentVars[column];
                    this.gaussJordan(row, column);
                }
            }
        }
    };
    SimplexBigM.prototype.makeIteration = function () {
        for (var i = 0; i < this.matrix[0].length - 1; i++) {
            var currentCoeff = void 0;
            if (Number.isNaN(Number(this.matrix[0][i]))) {
                currentCoeff = Algebrite.coeff(this.matrix[0][i], 'M', 1).toString();
            }
            else {
                currentCoeff = this.matrix[0][i];
            }
            if (currentCoeff < 0) {
                var min = Number.MAX_VALUE;
                var row = -1;
                for (var j = 1; j < this.matrix.length; j++) {
                    if (Number(this.matrix[j][i]) > 0) {
                        var ratio = Number(this.matrix[j][this.matrix[j].length - 1]) / Number(this.matrix[j][i]);
                        if (ratio < min) {
                            min = ratio;
                            row = j;
                        }
                    }
                }
                if (row === -1) {
                    console.log("No solution");
                    return;
                }
                this.multiplyRow(row, 1 / Number(this.matrix[row][i]));
                this.gaussJordan(row, i);
                this.basicVars[row] = this.currentVars[i];
            }
        }
    };
    SimplexBigM.prototype.checkSolved = function () {
        for (var i = 0; i < this.matrix[0].length - 1; i++) {
            var currentCoeff = void 0;
            if (Number.isNaN(Number(this.matrix[0][i]))) {
                currentCoeff = Algebrite.coeff(this.matrix[0][i], 'M', 1).toString();
            }
            else {
                currentCoeff = this.matrix[0][i];
            }
            if (currentCoeff < 0) {
                return false;
            }
        }
        return true;
    };
    SimplexBigM.prototype.multiplyRow = function (row, value) {
        for (var i = 0; i < this.matrix[row].length; i++) {
            if (typeof this.matrix[row][i] === 'number' && typeof value === 'number') {
                this.matrix[row][i] = Number(this.matrix[row][i]) * value;
            }
            else {
                this.matrix[row][i] = Algebrite.run(this.matrix[row][i] + "*" + value);
            }
        }
    };
    SimplexBigM.prototype.gaussJordan = function (row, column) {
        for (var i = 0; i < this.matrix.length; i++) {
            if (i === row) {
                continue;
            }
            var factor = void 0;
            if (typeof this.matrix[i][column] == "string") {
                factor = Algebrite.run("-(".concat(this.matrix[i][column], ") / ").concat(this.matrix[row][column])).toString();
                for (var j = 0; j < this.matrix[i].length; j++) {
                    this.matrix[i][j] = Algebrite.run(Math.rationalize("".concat(this.matrix[i][j], " + ").concat(this.matrix[row][j], " * (").concat(factor, ")")).toString()).toString();
                }
                continue;
            }
            else {
                factor = -Number(this.matrix[i][column]) / Number(this.matrix[row][column]);
                for (var j = 0; j < this.matrix[i].length; j++) {
                    this.matrix[i][j] = Number(this.matrix[i][j]) + Number(this.matrix[row][j]) * Number(factor);
                }
                continue;
            }
        }
    };
    SimplexBigM.prototype.getSolution = function () {
        var solution = {};
        for (var i = 0; i < this.basicVars.length; i++) {
            solution[this.basicVars[i]] = Number(this.matrix[i][this.matrix[i].length - 1]);
        }
        for (var i = 0; i < this.currentVars.length; i++) {
            if (this.basicVars.indexOf(this.currentVars[i]) === -1) {
                solution[this.currentVars[i]] = 0;
            }
        }
        var arraySolution = [];
        for (var solutionKey in solution) {
            if (solutionKey.indexOf("z") !== -1 && this.isMin) {
                arraySolution.push("".concat(solutionKey, " = ").concat(-solution[solutionKey]));
            }
            else {
                arraySolution.push("".concat(solutionKey, " = ").concat(solution[solutionKey]));
            }
        }
        arraySolution.sort(function (a, b) { return b.localeCompare(a); });
        return arraySolution;
    };
    SimplexBigM.prototype.getInfo = function () {
        console.log(this.currentVars);
        for (var i = 0; i < this.matrix.length; i++) {
            var row = this.basicVars[i] + "   ";
            for (var j = 0; j < this.matrix[i].length; j++) {
                row += this.matrix[i][j] + "   ";
            }
            console.log(row);
        }
    };
    return SimplexBigM;
}());
exports.default = SimplexBigM;
