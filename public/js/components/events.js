/**
 * events.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-03-05 15:04:24
 * @version $Id$
 */

'use strict'

let iterateTabs = function(tval, pval) {
	// 遍历 tab 元素
	document.querySelectorAll('.tabs').forEach(function(e) {
		// 判断 tab 是否更换样式
		if (e.id === tval) {
			if (!e.classList.contains('active')) {
				e.classList.add('active');
			}
		} else {
			e.classList.remove('active');
		}
	});

	// 遍历 panel 判断显示或者隐藏
	document.querySelectorAll('.panels').forEach(function(e) {
		if (e.id === pval) {
			if (!e.classList.contains('e-active')) {
				e.classList.add('e-active');
			}
		} else {
			e.classList.remove('e-active');
		}
	})
};

let bindTabClick = function() {
	let self = this,
		panelId = self.getAttribute('data-tab');

	iterateTabs(self.id, panelId);
}

let changeLoadState = function(id, type) {
	if (type) {
		document.getElementById(id).classList.add('active');
	} else {
		document.getElementById(id).classList.remove('active');
	}
};

export {
	bindTabClick,
	iterateTabs,
	changeLoadState
};