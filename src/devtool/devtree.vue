<template>
    <div id="devtree">
		<el-button type="success" class="el-icon-refresh" size="mini" @click="onBtnClickUpdatePage">捕获刷新</el-button>
		<div v-show="isShowDebug">
			<el-row>
			<el-col :span="8">
				<div class="grid-content treeList">
				<el-tree :data="treeData"
						:props="defaultProps"
						:expand-on-click-node="false"
						@node-click="handleNodeClick"></el-tree>
				</div>
			</el-col>
			</el-row>
		</div>
		<div v-show="!isShowDebug">
			未发现Laya的游戏!
		</div>
    </div>
</template>

<script>
	import treeinject from './treeinject.js'

	export default {
		name: "devtree",
		data() {
		return {
			isShowDebug: false,
			treeItemData: {},
			treeData: [],
		}
		},
		created() {
			let backgroundPageConnection = chrome.extension.connect({
				name: btoa("for" + String(chrome.devtools.inspectedWindow.tabId))
			});
			
			backgroundPageConnection.onMessage.addListener(function (message) {
				if (message !== null) {

					switch (message.type) {
						case window.LayaTreeMsg.updateNodeInfo:
							this.isShowDebug = true;
							this.updateView(message.msg);
							break;

						case window.LayaTreeMsg.updateNodeList:
							this.isShowDebug = false;
							break;

						case window.LayaTreeMsg.notSupport:
							this.isShowDebug = true;
							this.treeItemData = message.msg;
							break;
					}
				}
			}.bind(this));

			window.addEventListener('message', function (event) {
					console.log("on vue:" + JSON.stringify(event.data));
					console.log("on vue:" + JSON.stringify(event));
				}, false);
			},

			methods: {
				handleNodeClick(data) {
					let uuid = data.uuid;
					if (uuid !== undefined) {
						let code = "window.getNodeInfo('" + uuid + "')";
						chrome.devtools.inspectedWindow.eval(code);
					}
				},

				updateView(data) {
					// 构建树形数据
					this.treeData = [];
					let sceneData = data.scene;
					if (sceneData) {
						let dataRoot = {
							type: sceneData.type, uuid: sceneData.uuid,
							label: sceneData.name, children: []
						};
						this.treeData.push(dataRoot);
						this.handleNodeClick(dataRoot);

						for (let k in sceneData.children) {
							let itemSceneData = sceneData.children[k];
							let sceneItem = {};
							dealChildrenNode(itemSceneData, sceneItem);
							this.treeData[0].children.push(sceneItem);
						}
					}

					function dealChildrenNode(rootData, obj) {
						obj['data'] = rootData;
						obj['uuid'] = rootData.uuid;
						obj['label'] = rootData.name;
						obj['children'] = [];
						let rootChildren = rootData.children;
						for (let k in rootChildren) {
							let itemData = rootChildren[k];
							let item = {};
							dealChildrenNode(itemData, item);
							obj.children.push(item);
						}
					}
				},

				getInjectScriptString() {
					let code = treeinject.toString();
					let array = code.split('\n');
					array.splice(0, 3);// 删除开头
					let evalCode = "";
					for (let i = 0; i < array.length; i++) {
						evalCode += array[i] + '\n';
					}
					return evalCode;
				},

				onBtnClickUpdatePage() {
					let code = this.getInjectScriptString();
					chrome.devtools.inspectedWindow.eval(code, function () {
						console.log("刷新成功!");
					});
				},
    }
  }
</script>


