#优化的GraphicsLayer

 arcgis js api 4 会根据不同的比例尺简化graphicsLayer中的图形， 但在大比例尺下（放大后），对于节点较多（大于5000个节点）的polygon，存在渲染效率问题，针对这种情况，在较大的比例尺下OptimizeGraphicsLayer会根据地图显示范围，切割每个图形，从而减少渲染时卡顿的现象
![demo picture](https://github.com/Baozi926/OptimizeGraphicsLayer/blob/master/screenShot.png?raw=true)
# OptimizeGraphicsLayer
