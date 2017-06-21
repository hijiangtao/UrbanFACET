/**
 * events.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-03-05 15:04:24
 * @version $Id$
 */

'use strict'

let changeLoadState = function(id, type) {
	if (type) {
		document.getElementById(id).classList.add('active');
	} else {
		document.getElementById(id).classList.remove('active');
	}
};

export {
	changeLoadState
};