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

/**
 * 根据指定 index 数组中编号添加 map 容器
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
let appendMap = function(indexs) {
	let tcontainer = document.getElementById('vctab'),
		mcontainer = document.getElementById('mappanel'),
		isize = indexs.length;

	for (var i = 0; i < isize; i++) {
		let index = indexs[i],
			tab = document.createElement('div');
	}
	
	return isize*2;
};

/**
 * 删除 number 个地图实例,从尾部开始删, number = 1,2,3
 * @param  {[type]} number [description]
 * @return {[type]}        [description]
 */
let removeMaps = function(number) {
	let tcontainer = document.getElementById('vctab'),
		mcontainer = document.getElementById('mappanel'),
		isize = document.getElementsByClassName('vamap').length,
		preclass = isize === 4? 'formap':'twomap',
		curclass = isize === 4? 'twomap':'onemap';;

	for (let i=isize-1; i >= 0; i--) {
		let mchild = document.getElementById(`map${i}`),
			tchild = document.getElementById(`switch${i}`);

		// 判断当前节点是删除还是恢复样式
		if (number>0) {
			mcontainer.removeChild( mchild );
			tcontainer.removeChild( tchild );
			number -= 1;
		} else {
			mchild.classList.remove( preclass );
			mchild.classList.add( curclass );
		}
		
	}

	// 恢复第一个 tab 的聚焦
	iterateTabs('switch0', 'tab0');

	return isize-number;
};

let changeLoadState = function(id, type) {
	if (type) {
		document.getElementById(id).classList.add('active');
	} else {
		document.getElementById(id).classList.remove('active');
	}
};

export {
	appendMap,
	removeMaps,
	bindTabClick,
	iterateTabs,
	changeLoadState
};