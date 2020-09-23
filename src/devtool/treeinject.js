// 注入脚本的代码
export default function () {
    window.nodeMemoryStroge = window.nodeMemoryStroge || {};
    window.uuid = window.uuid || 0;

    window.sendMsgToDevTools = function (type, msg) {
        window.postMessage({type: type, msg: msg}, "*");
    };

    // 弧度转换为角度
    window.rad2degrees = function (radians) {
        var degrees = radians * (180 / Math.PI);
        return degrees.toFixed(3);
    };

    // 角度转换为弧度
    window.degrees2rad = function (degrees) {
        var radians = degrees * (Math.PI / 180);
        return radians.toFixed(3);
    };
        
    window.getNodeName = function (node) {
        var nodeName = node.constructor.name;
        if (node.$owner) {
            nodeName = node.$owner._name + "    " + node.$owner.constructor.name + "    " + name;
        }
        if (node.name) {
            nodeName = nodeName + "   " + node.name
        }
        return nodeName;
    };

    // 获取节点信息
    window.getNodeInfo = function (exId) {
        var node = window.nodeMemoryStroge[exId];
        if (node) {
            var nodeData;
            if (node.transform && (node.transform.constructor.name == 'Transform3D')) {
                var curTransform = node.transform
                nodeData = {
                    nodeType: 2,
                    type: node.constructor.name,
                    exId: node.exId,
                    name: node.name || "",
                    x: curTransform.localPositionX,
                    y: curTransform.localPositionY,
                    z: curTransform.localPositionZ,
                    rotationX: curTransform.localRotationEulerX,
                    rotationY: curTransform.localRotationEulerY,
                    rotationZ: curTransform.localRotationEulerZ,
                    scaleX: curTransform.localScaleX,
                    scaleY: curTransform.localScaleY,
                    scaleZ: curTransform.localScaleZ,
                    active: node.active
                };
            } else {
                nodeData = {
                    nodeType: 1,
                    type: node.constructor.name,
                    exId: node.exId,
                    name: node.name || "",
                    x: node.x,
                    y: node.y,
                    zOrder: node.zOrder,
                    width: node.width,
                    height: node.height,
                    visible: node.visible,
                    rotation: node.rotation,
                    scaleX: node.scaleX,
                    scaleY: node.scaleY,
                };
            }
            window.sendMsgToDevTools("updateNodeInfo", nodeData);
        } else {
            console.log("未获取到节点数据");
        }
    };

    window.pluginSetNodePosition = function (exId, x, y) {
        let node = window.nodeMemoryStroge[exId];
        if (node) {
            node.x = x;
            node.y = y;
        }   
    };

    window.pluginSetNodePosition3D = function (exId, x, y, z) {
        let node = window.nodeMemoryStroge[exId];
        if (node) {
            node.transform.localPositionX = x;
            node.transform.localPositionY = y;
            node.transform.localPositionZ = z;
        }   
    };

    window.pluginSetNodeSize = function (exId, width, height) {
        let node = window.nodeMemoryStroge[exId];
        if (node) {
            node.width = width;
            node.height = height;
        }
    };

    window.pluginSetNodeRotation = function (exId, rotation) {
        let node = window.nodeMemoryStroge[exId];
        if (node) {
            node.rotation = rotation;
        }
    };

    window.pluginSetNodeRotation3D = function (exId, rotationX, rotationY, rotationZ) {
        let node = window.nodeMemoryStroge[exId];
        if (node) {
            node.transform.localRotationEulerX = rotationX;
            node.transform.localRotationEulerY = rotationY;
            node.transform.localRotationEulerZ = rotationZ;
        }
    };

    window.pluginSetNodeScale3D = function (exId, scaleX, scaleY, scaleZ) {
        let node = window.nodeMemoryStroge[exId];
        if (node) {
            node.transform.localScaleX = scaleX;
            node.transform.localScaleY = scaleY;
            node.transform.localScaleZ = scaleZ;
        }
    };

    window.pluginSetNodeVisible = function (exId, isActive) {
        let node = window.nodeMemoryStroge[exId];
        if (node) {
            if (isActive == 1) {
                node.visible = true;
            } else {
                node.visible = false;
            }
        }
    };

    window.pluginSetNodeActive = function (exId, isActive) {
        let node = window.nodeMemoryStroge[exId];
        if (node) {
            if (isActive == 1) {
                node.active = true;
            } else {
                node.active = false;
            }
        }
    };

    // 检测是否包含Laya变量
    var isLayaGame = true;
    try {
        var layaGame = Laya;
    } catch (e) {
        isLayaGame = false;
        window.sendMsgToDevTools("notSupport", "不支持调试游戏!");
    }

    var postData = {
        stage: {
            name: "",
            children: []
        },
    };

    /**
     * 收集节点信息
     */
    function getNodeChildren(node, data) {
        let exId = node.exId;
        if (exId == null || exId == undefined) {
            window.uuid += 1;
            exId = window.uuid;
            node.exId = exId;
        }

        var name = window.getNodeName(node);
        var nodeData = {
            exId,
            name,
            children: [],
        };

        window.nodeMemoryStroge[exId] = node;
        
        var nodeChildren = [];
        if (node._children) {
            nodeChildren = node._children;
        } else if (node._childs) {
            nodeChildren = node._childs;
        }

        for (var i = 0; i < nodeChildren.length; i++) {
            var childItem = nodeChildren[i];
            getNodeChildren(childItem, nodeData.children);
        }

        data.push(nodeData);
    }

    if (isLayaGame) {

        window.addEventListener('beforeunload', ()=> {
            window.sendMsgToDevTools("beforeunload", {});
        }, false);

        window.nodeMemoryStroge = {};

        var stage = Laya.stage;
        if (stage) {
            exId = 0;
            var name = Laya.stage.constructor.name
            postData.stage = {
                type: 1,
                exId,
                name,
                children: [],
            };
            window.nodeMemoryStroge[exId] = stage;

            var stageChildren = [];
            if (stage._children) {
                stageChildren = stage._children;
            } else if (stage._childs) {
                stageChildren = stage._childs;
            }
            for (var i = 0; i < stageChildren.length; i++) {
                var node = stageChildren[i];
                getNodeChildren(node, postData.stage.children);
            }
            window.sendMsgToDevTools("updateNodeList", postData);
        } else {
            postData.stage = null;
            window.sendMsgToDevTools("notSupport", "不支持调试游戏!");
        }
    } else {
        window.sendMsgToDevTools("notSupport", "不支持调试游戏!");
    }

}
