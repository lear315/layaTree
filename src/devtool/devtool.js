chrome.devtools.panels.create(
    "LayaTree",
    "static/images/icon48.png",
    "devtree.html",
    function (panel) {
        console.log("LayaTree Dev Panel Created!");

        panel.onShown.addListener(function (window) {
            console.log("panel show");
        });

        panel.onHidden.addListener(function (window) {
            console.log("panel hide");
        });
        
        panel.onSearch.addListener(function (action, query) {
            console.log("panel search!");
            return false;
        });
    }
);

window.LayaTreeMsg = {
    updateNodeInfo: "updateNodeInfo", // 更新节点信息
    updateNodeList: "updateNodeList", // 节点列表信息
    notSupport: "notSupport", // 不支持的游戏
};
