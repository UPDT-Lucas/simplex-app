"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimplexBigM = /** @class */ (function () {
    function SimplexBigM(matrix, basicVars, currentVars, isMin) {
        this.matrix = matrix;
        this.basicVars = basicVars;
        this.currentVars = currentVars;
        this.isMin = isMin;
    }
    SimplexBigM.prototype.verifyArtificalM = function () {
        for (var i = 0; i < this.currentVars.length; i++) {
            if ((this.currentVars[i].charAt(0) === "a") && this.matrix[0][i] !== 'M') {
                return false;
            }
        }
        return true;
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
