"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var Algebrite = require("algebrite");
var Math = require("mathjs");
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
    SimplexBigM.prototype.getBasicVars = function () {
        return __spreadArray([], this.basicVars, true);
    };
    SimplexBigM.prototype.getCurrentVars = function () {
        return __spreadArray([], this.currentVars, true);
    };
    SimplexBigM.prototype.makeIteration = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var minCoeff = Number.MAX_VALUE;
            for (var i = 0; i < _this.matrix[0].length - 1; i++) {
                var actualCoeff = void 0;
                if (_this.matrix[0][i].toString().includes('M')) {
                    console.log('BEFORE ERROR ', _this.matrix[0][i].toString());
                    console.log('VEFORE ERROR ', Math.simplify(_this.matrix[0][i].toString()).toString());
                    actualCoeff = parseFloat(Algebrite.coeff(_this.matrix[0][i], 'M', 1).toString());
                    if (actualCoeff < minCoeff) {
                        minCoeff = actualCoeff;
                    }
                }
                else {
                    if (typeof _this.matrix[0][i] === 'string') {
                        actualCoeff = Math.evaluate(_this.matrix[0][i].toString());
                        if (actualCoeff < minCoeff) {
                            minCoeff = actualCoeff;
                        }
                    }
                    else {
                        actualCoeff = _this.matrix[0][i];
                        if (Number(actualCoeff) < minCoeff) {
                            minCoeff = Number(actualCoeff);
                        }
                    }
                }
            }
            console.log("MINCOEFF ", minCoeff);
            if (minCoeff >= 0) {
                resolve(-1);
            }
            for (var i = 0; i < _this.matrix[0].length - 1; i++) {
                var currentCoeff = void 0;
                if (_this.matrix[0][i].toString().includes('M')) {
                    currentCoeff = parseFloat(Algebrite.coeff(_this.matrix[0][i], 'M', 1).toString());
                }
                else {
                    currentCoeff = Math.evaluate(_this.matrix[0][i].toString());
                }
                console.log('currentCoeff ', currentCoeff, 'minCoeff ', minCoeff, 'compare ', currentCoeff == minCoeff);
                if (currentCoeff < 0 && currentCoeff == minCoeff) {
                    var min = Number.MAX_VALUE;
                    var row = -1;
                    for (var j = 1; j < _this.matrix.length; j++) {
                        if (Number(_this.matrix[j][i]) > 0) {
                            console.log('ratio params ', _this.matrix[j][_this.matrix[j].length - 1], _this.matrix[j][i]);
                            console.log('Fixed params ', Math.evaluate("(".concat(_this.matrix[j][_this.matrix[j].length - 1], ") / (").concat(_this.matrix[j][i], ")")));
                            var ratio = Math.evaluate("(".concat(_this.matrix[j][_this.matrix[j].length - 1], ") / (").concat(_this.matrix[j][i], ")"));
                            if (ratio < 0) {
                                ratio = Number.MAX_VALUE;
                            }
                            if (ratio < min) {
                                min = ratio;
                                row = j;
                            }
                            console.log('ratio ', ratio, 'min ', min, 'row ', row, 'column ', i);
                        }
                    }
                    if (row === -1) {
                        resolve(-1);
                    }
                    _this.multiplyRow(row, 1 / Number(_this.matrix[row][i]));
                    _this.gaussJordan(row, i);
                    _this.basicVars[row] = _this.currentVars[i];
                    break;
                }
            }
            resolve(1);
        });
    };
    SimplexBigM.prototype.checkSolved = function () {
        for (var i = 0; i < this.matrix[0].length - 1; i++) {
            var currentCoeff = void 0;
            if (this.matrix[0][i].toString().includes('M')) {
                currentCoeff = Algebrite.coeff(Math.rationalize(this.matrix[0][i].toString()).toString(), 'M', 1).toString();
            }
            else {
                currentCoeff = this.matrix[0][i];
            }
            if (parseFloat(currentCoeff) < 0) {
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
                this.matrix[row][i] = Math.simplify(this.matrix[row][i] + "*" + value).toString();
            }
        }
    };
    SimplexBigM.prototype.gaussJordan = function (row, column) {
        for (var i = 0; i < this.matrix.length; i++) {
            if (i === row) {
                continue;
            }
            var factor = void 0;
            if (typeof this.matrix[i][column] == "string" || true) {
                var factorToAssign = this.matrix[i][column].toString();
                if (factorToAssign.includes('M')) {
                    factor = Math.simplify(Math.rationalize("-(".concat(this.matrix[i][column].toString(), ") / (").concat(this.matrix[row][column], ")")).toString()).toString();
                    console.log('factor before1 ', this.matrix[i][column].toString());
                    console.log('PARam factor1 ', "-(".concat(this.matrix[i][column].toString(), ") / (").concat(this.matrix[row][column], ")"));
                }
                else {
                    factor = Math.simplify(Math.rationalize("-(".concat(this.matrix[i][column].toString(), ") / (").concat(this.matrix[row][column], ")")).toString()).toString();
                    console.log('factor before2 ', this.matrix[i][column].toString());
                    console.log('PARam factor2 ', "-(".concat(this.matrix[i][column].toString(), ") / (").concat(this.matrix[row][column], ")"));
                }
                console.log('FACTOR ', factor);
                for (var j = 0; j < this.matrix[i].length; j++) {
                    console.log(this.matrix[i][j].toString().includes('M'));
                    console.log("CUR MAT ", this.matrix[i][j]);
                    if (this.matrix[i][j].toString().includes('M')) {
                        console.log("PAram mat1 ".concat(this.matrix[i][j].toString(), " + ").concat(this.matrix[row][j].toString(), " * (").concat(factor, ")"));
                        this.matrix[i][j] = Math.simplify(Math.rationalize("".concat(this.matrix[i][j].toString(), " + ").concat(this.matrix[row][j].toString(), " * (").concat(factor, ")")).toString()).toString();
                    }
                    else {
                        console.log("PAram mat2 ".concat(this.matrix[i][j].toString(), " + ").concat(this.matrix[row][j].toString(), " * (").concat(factor, ")"));
                        console.log('ratio ', Math.rationalize("".concat(this.matrix[i][j].toString(), " + ").concat(this.matrix[row][j].toString(), " * (").concat(factor, ")")).toString());
                        this.matrix[i][j] = Math.simplify(Math.rationalize("".concat(this.matrix[i][j].toString(), " + ").concat(this.matrix[row][j].toString(), " * (").concat(factor, ")")).toString()).toString();
                    }
                    console.log("RESULT MAT ", this.matrix[i][j]);
                    this.getInfo();
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
