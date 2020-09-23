<template>
    <div id="devtree">
		<div> {{serverInfo}}</div>
		<div style="margin-top:5px;margin-left:5px">  
			<el-row>
				<el-col :span="24">
					<div class="grid-content bg-purple-dark">
						<div v-if="layaStatePause === false">
							<el-button ref="pauseBtn" type="primary" class="el-icon-time" size="mini" @click="onBtnClickPausePage"> 暂停</el-button>
							<el-button ref="stepBtn" type="info" class="el-icon-arrow-right" size="mini" @click="onBtnClickStepPage"> 单帧</el-button>
						</div>
						<div v-else>
							<el-button ref="pauseBtn" type="warning" class="el-icon-time" size="mini" @click="onBtnClickPausePage"> 暂停</el-button>
							<el-button ref="stepBtn" type="primary" class="el-icon-arrow-right" size="mini" @click="onBtnClickStepPage"> 单帧</el-button>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div style="margin-top:5px;margin-left:5px"> 
			<el-button ref="refreshBtn" type="success" class="el-icon-refresh" size="mini" @click="onBtnClickUpdatePage">捕获刷新</el-button>
		</div>
		<div v-show="isShowDebug">
			<el-row>
				<el-col :span="8">
					<div class="grid-content tree-height" >
					<el-tree :data="treeData"
							:props="defaultProps"
							ref="vuetree"
							:expand-on-click-node="false"
							@node-click="handleNodeClick"
							node-key="exId"
							:default-expanded-keys="defaultExpandKeys"
							:highlight-current="true"
							></el-tree>
					</div>
				</el-col>
				<el-col :span="16" >
					<div class="grid-content tree-height node-info">
						<node2dproperty v-bind:itemData="treeItemData" v-show="nodeInfoType == 1"></node2dproperty>
						<node3dproperty v-bind:itemData="treeItemData" v-show="nodeInfoType == 2"></node3dproperty>
					</div>
				</el-col>
			</el-row>
		</div>
		<div v-show="!isShowDebug">
			未发现Laya的游戏!!
		</div>
    </div>
</template>

<script>

	import treeinject from './treeinject.js'
	import loopinject from './gameloopinject.js'

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
				nodeInfoType: 0,
				serverInfo: "",
				layaStatePause: false,
				curSelectIndex: 0,
				defaultExpandKeys: [],
			}
		},

		created() {

			// 检查版本更新
			this.$http.get(chrome.extension.getURL('manifest.json'), {
			}).then(function(response){  
				var version = response.body.version;
				this.$http.get('http://193.112.105.97:8066/updateInfo?version=' + version, {
				}).then(function(response){  
					// response.data中获取ResponseData实体
					this.serverInfo = response.bodyText;
				},function(response){  
					// 发生错误
					this.serverInfo = "服务器欠费啦~~"
				});
			},function(response){  
				// 发生错误
				this.serverInfo = "codeAI检测结果:你的代码风格过时了~~"
			});

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
							this.forceHandleNodeClick();
							break;

						case "updateNodeInfo":
							this.isShowDebug = true;
							this.treeItemData = message.msg;
							if (this.treeItemData.nodeType == 1) 
							{
								this.nodeInfoType = 1;
							} else if (this.treeItemData.nodeType == 2) {
								this.nodeInfoType = 2;
							}
							break;

						case "notSupport":
							this.isShowDebug = false;
							break;
						
						case "beforeunload":
							// 页面刷新
							this.$refs['refreshBtn'].disabled = true;
							this.layaStatePause = false;
							this.isShowDebug = false;
							this.curSelectIndex = 0;

							setTimeout(() => {
								this.forceRefresh();
							}, 2000);
							break;
					}
				}
			}.bind(this));

			window.addEventListener('message', function (event) {
					console.log("on vue:" + JSON.stringify(event.data));
					console.log("on vue:" + JSON.stringify(event));
			}, false);


			// 初始列表
			this.onBtnClickUpdatePage();

			// 侵入主循环 window.requestAnimationFrame
			this.initLayaLoopInject();
		},

		methods: {
			forceRefresh() {
				
				this.$refs['refreshBtn'].disabled = false;
				this.initLayaLoopInject();
				this.onBtnClickUpdatePage();
			},

			handleNodeClick(data) {
				let exId = data.exId;
				this.curSelectIndex = exId;
				this.selectNodeShowInfo(exId);
			},

			forceHandleNodeClick() {
				this.$nextTick(() => {
					this.selectNodeShowInfo(this.curSelectIndex);
				});
				
			},

			selectNodeShowInfo(exId) {
				this.$refs['vuetree'].setCurrentKey(exId);
				if (exId !== undefined) {
					let code = "window.getNodeInfo('" + exId + "')";
					chrome.devtools.inspectedWindow.eval(code);
				}
			},


			updateView(data) {
				this.defaultExpandKeys = [];
				this.defaultExpandKeys.push(this.curSelectIndex);

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
					this.selectNodeShowInfo(dataRoot.exId);

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

			getInjectScriptString(code) {
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
				let rawcode = treeinject.toString();
				let code = this.getInjectScriptString(rawcode);
				chrome.devtools.inspectedWindow.eval(code, function (result, e) {
					console.log("刷新成功!");
				});
			},

			// 游戏暂停
			onBtnClickPausePage() {
				if (this.isShowDebug == false) {
					return;
				}

				if (this.layaStatePause == false) {
					this.$refs['pauseBtn'].type = "warning";
					this.$refs['stepBtn'].type = "primary";
					chrome.devtools.inspectedWindow.eval(" window.layaStatePause = true;", function (result, e) {
						console.log("暂停成功!");
					});
					this.layaStatePause = true;

				} else {
					this.$refs['pauseBtn'].type = "primary";
					this.$refs['stepBtn'].type = "info";
					chrome.devtools.inspectedWindow.eval(" window.layaStatePause = false;", function (result, e) {
						console.log("恢复成功!");
					});
					this.layaStatePause = false;
				}
			},

			// 单帧运行
			onBtnClickStepPage() {
				if (this.isShowDebug == false) {
					return;
				}
				
				if (this.layaStatePause == true) {
					chrome.devtools.inspectedWindow.eval(" window.layaStepCount += 2;", function (result, e) {
						console.log("单帧成功!");
					});
				}
			},

			initLayaLoopInject() {
				let rawcode = loopinject.toString();
				let code = this.getInjectScriptString(rawcode);
				chrome.devtools.inspectedWindow.eval(code, function (result, e) {
					console.log("循环注入成功!");
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

	body span h1 h2 h3 {
		font-family: BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Lucida Grande', 'Segoe UI', Ubuntu, Cantarell, 'SourceHanSansCN-Normal', Arial, sans-serif
	}

	.node-info {
		position: fixed;
		top: 30px;
		background: #ffffff;
	}
</style>


