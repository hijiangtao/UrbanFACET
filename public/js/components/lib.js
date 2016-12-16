/**
 * 
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-07 12:31:51
 * @version $Id$
 */

let ArrayContains = function(obj, val) {
    var i = obj.length;
    while (i--) {
        if (obj[i] == val) {
            return true;
        }
    }
    return false;
}

export {
	ArrayContains
}