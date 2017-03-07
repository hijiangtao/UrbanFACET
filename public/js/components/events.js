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
		if (e.id === tval && !e.classList.contains('active')) {
			e.classList.add('active');
		} else {
			e.classList.remove('active');
		}
	});

	// 遍历 panel 判断显示或者隐藏
	document.querySelectorAll('.panels').forEach(function(e) {
		if (e.id === pval && !e.classList.contains('active')) {
			e.classList.add('active');
		} else {
			e.classList.remove('active');
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
		isize = indexs.length,
		preclass = isize === 1? 'onemap':'twomap',
		curclass = isize === 1? 'twomap':'formap';

	for (var i = 0; i < isize; i++) {
		let index = indexs[i],
			map = document.createElement("div"),
			tab = document.createElement('div');

		// 添加 tab 标签项
		tab.setAttribute('data-tab', `tab${index}`);
		tab.setAttribute('id', `switch${index}`);
		tab.classList.add('tabs', 'item');
		tab.innerHTML = `OBJ${index}`;

		tcontainer.insertBefore(tab, document.getElementById("addObjBtn"));

		// 修改原有 map 容器样式
		document.getElementById( `map${i}` ).classList.remove(preclass);
		document.getElementById( `map${i}` ).classList.add(curclass);

		// 添加 map 容器
		map.classList.add(curclass, 'vamap', 'ui', 'segment');
		map.innerHTML = `<div id='maplegend${index}'>
			<svg id='gridmaplegend${index}' height='50'></svg>
			<div id='contourmaplegend${index}' ></div>
		</div>
		<div class='ui dimmer'><div class="ui medium text loader">Loading Data</div></div>`;
		map.setAttribute('id', `map${index}`);
		mcontainer.appendChild(map);

		// 绑定点击事件
		tab.addEventListener('click', bindTabClick);
	}
	
	return isize*2;
};

/**
 * 删除 number 个地图实例,从尾部开始删, number = 1,2,3
 * @param  {[type]} number [description]
 * @return {[type]}        [description]
 */
let removeMaps = function(number) {
	let tcontainer = document.getElementById(''),
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
			tchild.classList.remove( preclass );
			tchild.classList.add( curclass );
		}
		
	}

	// 恢复第一个 tab 的聚焦
	iterateTabs('0', '0');

	return isize-number;
};

export {
	appendMap,
	removeMaps,
	bindTabClick
};