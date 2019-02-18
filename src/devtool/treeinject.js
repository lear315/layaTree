// 注入脚本的代码
export default function () {
    window.nodeMemoryStroge = window.nodeMemoryStroge || {};

    window.sendMsgToDevTools = function (type, msg) {
        window.postMessage({type: type, msg: msg}, "*");
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
            if (node.transform && node.transform.constructor.name == 'Transform3D') {
                nodeData = {
                    nodeType: 2,
                    type: node.constructor.name,
                    exId: node.exId,
                    name: node.name,
                    transform: node.transform
                };
            } else {
                nodeData = {
                    nodeType: 1,
                    type: node.constructor.name,
                    exId: node.exId,
                    name: node.name,
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
     * 索引id
     */
    var exId = 0;

    /**
     * 收集节点信息
     */
    function getNodeChildren(node, data) {
        exId = exId + 1;
        var name = window.getNodeName(node);

        var nodeData = {
            exId,
            name,
            children: [],
        };

        window.nodeMemoryStroge[exId] = node;
        node.exId = exId;

        var nodeChildren = node._children;
        for (var i = 0; i < nodeChildren.length; i++) {
            var childItem = nodeChildren[i];
            getNodeChildren(childItem, nodeData.children);
        }

        data.push(nodeData);
    }

    if (isLayaGame) {

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

            var stageChildren = stage._children;;
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
