/**
 * 
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-07 12:31:51
 * @version $Id$
 */

let ArrayContains = function(obj, val) {
    let i = obj.length;
    while (i--) {
        if (obj[i] === val) {
            return true;
        }
    }
    return false;
}

let MatrixAdd = function(a, b, times, dim) {
    let result = [];

    if (dim == 1) {
        for (let i = 0; i < a.length; i++) {
            result.push(Number.parseFloat(a[i]) + Number.parseFloat(b[i]));
        }
        return result
    }

    for (let i = 0; i < a.length; i++) {

        let arr = []; // 一般矩陣
        for (let j = 0; j < a[i].length; j++) {
            let sum = (Number.parseFloat(a[i][j]) + Number.parseFloat(b[i][j])) * times;
            arr.push(sum);
        }
        result.push(arr);
    }

    return result
}

let genNumArr = function(base, sep, num) {
    base = Number.parseInt(base), sep = Number.parseInt(sep), num = Number.parseInt(num)
    let array = []
    for (var i = 0; i < num; i++) {
        array.push(base + sep * i)
    }
    return array
}

export {
    ArrayContains,
    MatrixAdd,
    genNumArr
}
