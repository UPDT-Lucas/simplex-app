"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Simplex = /** @class */ (function () {
    function Simplex(matrix, basicVars, currentVars) {
        this.matrix = matrix;
        this.basicVars = basicVars;
        this.currentVars = currentVars;
    }
    Simplex.prototype.balanceArtificalVars = function () {
        for (var i = 0; i < this.currentVars.length; i++) {
            if (this.currentVars[i].charAt(0) === "a") {
                var column = i;
                var row = -1;
                for (var j = 2; j < this.matrix.length; j++) {
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
    Simplex.prototype.makeFaseOneIteration = function () {
        for (var i = 0; i < this.matrix[0].length; i++) {
            if (this.matrix[0][i] < 0) {
                var min = Number.MAX_VALUE;
                var row = -1;
                for (var j = 2; j < this.matrix.length; j++) {
                    if (this.matrix[j][i] > 0) {
                        var ratio = this.matrix[j][this.matrix[j].length - 1] / this.matrix[j][i];
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
                this.multiplyRow(row, 1 / this.matrix[row][i]);
                this.gaussJordan(row, i);
                this.basicVars[row] = this.currentVars[i];
            }
        }
    };
    Simplex.prototype.prepareFaseTwo = function () {
        this.basicVars.splice(0, 1);
        this.matrix.splice(0, 1);
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                if (this.currentVars[j].charAt(0) === "a") {
                    this.matrix[i].splice(j - 1, 1);
                }
            }
        }
        this.currentVars = this.currentVars.filter(function (value) { return value.charAt(0) !== "a"; });
    };
    Simplex.prototype.makeFaseTwoIteration = function () {
        for (var i = 0; i < this.matrix[0].length; i++) {
            if (this.matrix[0][i] < 0) {
                var min = Number.MAX_VALUE;
                var row = -1;
                for (var j = 1; j < this.matrix.length; j++) {
                    if (this.matrix[j][i] > 0) {
                        var ratio = this.matrix[j][this.matrix[j].length - 1] / this.matrix[j][i];
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
                this.multiplyRow(row, 1 / this.matrix[row][i]);
                this.gaussJordan(row, i);
                this.basicVars[row] = this.currentVars[i];
            }
        }
    };
    Simplex.prototype.getMatrix = function () {
        return this.matrix;
    };
    Simplex.prototype.multiplyRow = function (row, factor) {
        for (var i = 0; i < this.matrix[row].length; i++) {
            this.matrix[row][i] *= factor;
        }
    };
    Simplex.prototype.gaussJordan = function (row, column) {
        for (var i = 0; i < this.matrix.length; i++) {
            if (i === row) {
                continue;
            }
            var factor = -this.matrix[i][column] / this.matrix[row][column];
            for (var j = 0; j < this.matrix[i].length; j++) {
                this.matrix[i][j] += this.matrix[row][j] * factor;
            }
        }
    };
    Simplex.prototype.getInfo = function () {
        console.log(this.currentVars);
        for (var i = 0; i < this.matrix.length; i++) {
            var row = this.basicVars[i] + "   ";
            for (var j = 0; j < this.matrix[i].length; j++) {
                row += this.matrix[i][j] + "   ";
            }
            console.log(row);
        }
    };
    return Simplex;
}());
exports.default = Simplex;
