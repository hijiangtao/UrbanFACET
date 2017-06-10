# UrbanFACET Wiki

## Outline

* 页面 | [Pages]
* 绘制与模型 | [Visualization and Models]
* 路由 | [Routes]
* APIs | [APIs]
* 数据处理脚本 | [Scripts]
* 批处理与数据库信息 | [Shell and Databases]

## 页面

### EJS 模板（视图）

* home: 用于存储组成 home 页面的展示组件，其中 `panel.ejs` 为配置面板展示组件， `dynamic.ejs` 为对比分析展示页面组件， `mapcard.ejs` 为地图信息卡片组件；
* error.ejs: 404 页面；
* home.ejs: 主界面入口；

文件夹 `/views`

```
├── error.ejs
├── home
│   ├── dynamic.ejs
│   ├── mapcard.ejs
│   └── panel.ejs
└── home.ejs

1 directory, 5 files
```

### 静态资源（图片）

所有页面所涉及到的自定义设计图标文件均存放在 `/public/assets` 文件夹中。

## 绘制与模型

文件夹 `/public/js/`

```
├── components
│   ├── apis.js
│   ├── chartview.js
│   ├── events.js
│   ├── hmap-view.js
│   ├── init.js
│   ├── lib.js
│   ├── map.js
│   └── RadarChart.js
├── dynamic.js
├── home.js
└── lib
    ├── semantic.js
    └── semantic.min.js
```

### 可视化绘制与前台数据处理方法相关

* components/
	* init.js: 存储页面初始化实例所要用到的 data
	* lib.js: 通用函数，包括矩阵计算，生成数组等常用函数，用于前端部分
	* map.js: 基于 Leaflet.js 抽象的 canvas 绘制部分，用于替换采用 svg 绘制海量点的做法
	* hmap-view.js: 地图类，用于生成地图实例，以及相关 heatmap, gridmap, pointmap, scatterplot 等绘制函数
* home.js: 页面查询及可视化主入口
* dynamic.js: 动态查询页面生成组件

### 视图模型与状态管理相关

* 视图模型

## 路由

* index: 渲染页面路由
* comp: 查询路由 API

## APIs

* TBD

### conf (backend)

* data.js: 储存关键的一些 key-value 描述词-对应查询词，通过 getValue 函数传参的形式获取 value 并返回
* db.js: MySQL 配置设置
* entropy.js: entropy 计算相关函数
	* readIdlistMongo:从 Mongodb 读取 idlist
    * readIdlistFile: 从文件读取 idlist
	* connectMongo: 连接 Mongodb 
	* mongoQueries: Mongodb 用户 idlist/records 三段联合查询
* lib.js: 通用函数
* records.js: 定位记录处理相关函数

```
├── data
│   ├── bj.json
│   ├── bj_poidis.json
│   ├── metrics.json
│   ├── poidis.json
│   ├── tj.json
│   ├── tj_poidis.json
│   ├── ts.json
│   ├── ts_poidis.json
│   ├── zjk.json
│   └── zjk_poidis.json
├── data.js
├── db.js
├── eMax.js
├── entropy.js
├── lib.js
└── records.js
```

## 数据处理脚本

### python scripts



## 批处理与数据库信息

### data

* cluster
* decompose
* init
* label
* tmp