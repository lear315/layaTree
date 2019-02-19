<template>
    <div id="devtree">
		<el-button type="success" class="el-icon-refresh" size="mini" @click="onBtnClickUpdatePage">捕获刷新</el-button>
		<div v-show="isShowDebug">
			<el-row>
				<el-col :span="8">
					<div class="grid-content tree-height" >
					<el-tree :data="treeData"
							:props="defaultProps"
							:expand-on-click-node="false"
							@node-click="handleNodeClick"></el-tree>
					</div>
				</el-col>
				<el-col :span="16">
					<div class="grid-content bg-color-light tree-height">
						<node2dproperty v-bind:itemData="treeItemData"></node2dproperty>
						<!-- <node3dproperty v-show=" treeItemData.nodeType == 2"></node3dproperty> -->
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
				treeItemData: {
                    nodeType: "",
                    type: "",
                    exId: "",
                    name: "",
                    x: 0,
                    y: 0,
                    zOrder: 0,
                    width: 0,
                    height: 0,
                    visible: false,
                    rotation: 0,
                    scaleX: 0,
                    scaleY: 0,
				},
				treeData: [],
			}
		},
		created() {
			if (chrome && chrome.extension) {

			} else {
				return;
			}

			let backgroundPageConnection = chrome.extension.connect({
				name: btoa("for" + String(chrome.devtools.inspectedWindow.tabId))
			});
			
			backgroundPageConnection.onMessage.addListener(function (message) {
				
				if (message !== null) {

					switch (message.type) {
						case "updateNodeList":
							this.isShowDebug = true;
							this.updateView(message.msg);
							break;

						case "updateNodeInfo":
							this.isShowDebug = true;
							this.treeItemData = message.msg;
							break;

						case "notSupport":
							this.isShowDebug = false;
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
					let exId = data.exId;
					if (exId !== undefined) {
						let code = "window.getNodeInfo('" + exId + "')";
						chrome.devtools.inspectedWindow.eval(code);
					}
				},

				updateView(data) {
					// 构建树形数据
					this.treeData = [];
					let stageData = data.stage;
					if (stageData) {
						let dataRoot = {
							type: stageData.type, 
							exId: stageData.exId,
							label: stageData.name, 
							children: []
						};
						this.treeData.push(dataRoot);
						this.handleNodeClick(dataRoot);

						for (let k in stageData.children) {
							let itemData = stageData.children[k];
							let nodeItem = {};
							dealChildrenNode(itemData, nodeItem);
							this.treeData[0].children.push(nodeItem);
						}
					}

					function dealChildrenNode(rootData, obj) {
						obj['data'] = rootData;
						obj['exId'] = rootData.exId;
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
					array.splice(0, 1);// 删除开头
        			array.splice(-1, 1);// 删除结尾
					let evalCode = "";
					for (let i = 0; i < array.length; i++) {
						evalCode += array[i] + '\n';
					}
					return evalCode;
				},

				onBtnClickUpdatePage() {
					let code = this.getInjectScriptString();
					chrome.devtools.inspectedWindow.eval(code, function (result, e) {
						console.log("刷新成功!");
					});
				},
    }
  }
</script>

<style scoped>
  .tree-height {
    height: 100%
  }

  .bg-color {
    background: #d3dce6;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 20px;
  }

  .bg-color-light {
    background: #e5e9f2;
  }

  body span h1 h2 h3 {
    font-family: BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Lucida Grande', 'Segoe UI', Ubuntu, Cantarell, 'SourceHanSansCN-Normal', Arial, sans-serif
  }
</style>


