/**
 * 注入脚本的代码
 */
export default function () {
    window.nodeMemoryStroge = window.nodeMemoryStroge || {};

    window.sendMsgToDevTools = function (type, msg) {
        window.postMessage({type: type, msg: msg}, "*");
    };

    // 检测是否包含Laya变量
    let isLayaGame = true;
    try {
        let layaGame = Laya;
    } catch (e) {
        isLayaGame = false;
        window.sendMsgToDevTools("notSupport", "不支持调试游戏!");
    }

    let postData = {
        stage: {
            name: "",
            children: []
        },
    };

    /**
     * 索引id
     */
    let exId = 0;


    /**
     * 收集节点信息
     */
    function getNodeChildren(node, data) {
        exId = exId + 1;
        let name = node.constructor.name;
        if (node.$owner) {
            name = name + " " + node.$owner.constructor.name;
        }

        let nodeData = {
            exId,
            name,
            children: [],
        };

        window.inspectorGameMemoryStorage[exId] = node;

        let nodeChildren = node._children;
        for (let i = 0; i < nodeChildren.length; i++) {
            let childItem = nodeChildren[i];
            getNodeChildren(childItem, nodeData.children);
        }

        data.push(nodeData);
    }

    if (isLayaGame) {

        let stage = Laya.stage;
        if (stage) {
            exId = 0;
            let name = Laya.stage.constructor.name
            postData.stage = {
                type: 1,
                exId,
                name,
                children: [],
            };
            window.nodeMemoryStroge[exId] = stage;

            let stageChildren = stage._children;
            for (let i = 0; i < stageChildren.length; i++) {
                let node = stageChildren[i];
                getNodeChildren(node, postData.stage.children);
            }
            window.sendMsgToDevTools("nodeListInfo", postData);
        } else {
            postData.stage = null;
            window.sendMsgToDevTools("notSupport", "不支持调试游戏!");
        }
    } else {
        window.sendMsgToDevTools("notSupport", "不支持调试游戏!");
    }
}
