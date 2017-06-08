## Current Progress
### HTML (FE part)
#### EJS templates (views)

* home-x: 用于 home 页面的展示组件，按照页面拆分分类
* error.ejs: 404 页面
* home.ejs: 原有保留的尽可能多的功能展示页面

#### img/data

* cluster
* decompose
* init
* tmp

### JS (FE part)

* components/
	* analysistools.js: 描绘数据统计与 matrix 结果分析的抽象类
	* initdata.js: 存储页面初始化实例所要用到的 data
	* lib.js: 通用函数，包括矩阵计算，生成数组等常用函数，用于前端部分
	* map.js: 基于 Leaflet.js 抽象的 canvas 绘制部分，用于替换采用 svg 绘制海量点的做法
	* mapview.js: 地图类，用于生成地图实例，以及相关 heatmap, gridmap, pointmap, scatterplot 等绘制函数
* home.js: 原有保留的尽可能多的功能展示页面，包括降维、聚类、label、查询及可视化等部分
* dynamic.js: 动态查询页面生成组件

### ROUTES (middle-ware)

* home: 主页
* index: 渲染页面路由
* comp: 查询路由 API

### APIs (backend)

* demo/tsnetrain: 原有的 t-SNE 降维算法实现，替换为现有根据城市以及采样比例对城市 entropy 分布进行查询计算，并返回基于网格的 entropy 分布数据
* demo/entropyfilter: 基于用户给定的 filter 范围对符合条件的用户进行筛选，将结果以同样形式输出至前端
* demo/clustertrain: 将前端传输的 cluster 方法与参数处理，用于执行分类任务，同时将分类结果的二维空间映射处理成画图所用数据传送至前端，暂时弃用。
* demo/labeltrain: 根据用户选择的主题 （education/entertainment, ...）对类别进行筛选，按照用户给定比例将 TOP-N 类别取出返回前端
* demo/vcquery: 根据用户提供的日期类型与时间段参数，对指定类别的用户定位记录进行查询，并组织成 GeoJSON 返回前端
* demo/classplot: 计算当前聚类结果后的 scatter plot 并返回相应数据以及 matrixlist
* demo/madisplayquery: 对具体时间段数据选择进行查询分析，返回所有符合要求的定位记录
* demo/areaentropyquery: 基于现有选择的 area 筛选用户，并用筛选后的结果计算 city entropy，返回用户 city entropy distribution 数据用于做图
* demo/areatprecordsquery: 对用户定位记录进行查询，筛选出符合选择区域的指定时间段数据，并返回 GeoJSON 格式数据用于画图

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
* mysql.backup: area 相关数据表建立与插入等信息

### scripts (backend/server)

#### python scripts
* ClusterUser.py
* CommonCla.py
* CommonFunc.py
* DBScan.py
* DataImplement.py
* DecomposeFeature.py
* EntropyStats.py
* FeatureConstruction.py
* GridConstruction.py
* LatLngCal.py
* POIExtraction.py

#### data
* cluster
* decompose
* init
* label
* tmp