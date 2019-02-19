<template>
    <div id="node2dinfo">
        <div>
            <uiprop name="ExId">
                <span> {{itemData.exId}}</span>
            </uiprop>

            <uiprop name="Type">
                <span> {{itemData.type}}</span>
            </uiprop>

            <uiprop name="Name">
                <span> {{itemData.name}}</span>
            </uiprop>

            <uiprop name="Position">
                <div style="float: left;width: 100%;">
                    <uiprop name="X" style="width: 50%;float: left; cursor: ew-resize;"
                    @movestep="changePositionActionX"
                    step="10">
                        <input class="myInput"
                        @change="changePosition"
                        placeholder="itemData.x"
                        v-model="itemData.x">
                    </uiprop>

                    <uiprop name="Y" style="width: 50%;float: left; cursor: ew-resize;"
                    @movestep="changePositionActionY"
                    step="10">
                        <input class="myInput"
                        @change="changePosition"
                        placeholder="itemData.x"
                        v-model="itemData.x">
                    </uiprop>
                </div>
            </uiprop>

            <uiprop name="Rotation">
                <input class="myInput" 
                    @change="changeRotation"
                    placeholder="itemData.rotation" 
                    v-model="itemData.rotation"
                    style="width: 98%"> 
            </uiprop>

            <uiprop name="Scale">
                <div style="float: left;width: 100%;">
                    <uiprop name="X" style="width: 50%;float: left;">
                        <span>{{itemData.scaleX}}</span>
                    </uiprop>
                    <uiprop name="Y" style="width: 50%;float:left;">
                        <span>{{itemData.scaleY}}</span>
                    </uiprop>
                </div>
            </uiprop>

            <uiprop name="Size">
                <div style="float: left;width: 100%;">
                    <uiprop name="W" style="width: 50%;float: left;cursor: ew-resize;"
                            @movestep="changeSizeActionWidth"
                            step="10">
                        <input class="myInput"
                            @change="changeSize"
                            placeholder="itemData.width"
                            v-model="itemData.width">
                    </uiprop>
                    <uiprop name="H" style="width: 50%;float:left;cursor: ew-resize;"
                            @movestep="changeSizeActionHeight"
                            step="10">
                        <input class="myInput"
                            @change="changeSize"
                            placeholder="itemData.height"
                            v-model="itemData.height">
                    </uiprop>
                </div>
            </uiprop>

            <uiprop name="visible">
                <p v-if="itemData.visible" style="margin: 0;display: flex;align-items: center;flex-wrap: wrap;">
                    <input type="checkbox"
                        style="width: 20px;height: 20px;"
                        :checked="itemData.visible"
                        @click="onBtnClickNodeHide">
                    隐藏节点
                </p>

                <p v-if="!itemData.visible" style="margin: 0;display: flex;align-items: center;flex-wrap: wrap;">
                    <input type="checkbox"
                        style="width: 20px;height: 20px;"
                        :checked="itemData.visible"
                        @click="onBtnClickNodeShow"
                    >
                    显示节点
                </p>
            </uiprop>

            <uiprop name="zOrder">
                <span>{{itemData.zOrder}}</span>
            </uiprop>
        </div>
    </div>
</template>

<script>
    export default {
        name: "node2dinfo",

        data() {
            return {}
        },

        methods: {
            changeSizeActionWidth(step) {
                let w = parseFloat(this.itemData.width);
                this.itemData.width = w + step;
                this.changeSize();
            },


            changeSizeActionHeight(step) {
                let h = parseFloat(this.itemData.height);
                this.itemData.height = h + step;
                this.changeSize();
            },

            changePositionActionX(step) {
                let x = parseFloat(this.itemData.x);
                this.itemData.x = x + step;
                this.changePosition();
            },

            changePositionActionY(step) {
                let y = parseFloat(this.itemData.y);
                this.itemData.y = y + step;
                this.changePosition();
            },

            changePosition() {
                this._evalCode(
                    "window.pluginSetNodePosition(" +
                    "'" + this.itemData.exId + "'," +
                    "'" + this.itemData.x + "'," +
                    "'" + this.itemData.y + "'" +
                    ")");
                this._freshNode();
            },

            changeSize() {
                this._evalCode(
                "window.pluginSetNodeSize(" +
                "'" + this.itemData.exId + "'," +
                "'" + this.itemData.width + "'," +
                "'" + this.itemData.height + "'" +
                ")");
                this._freshNode();
            },

            changeRotation() {
                this._evalCode(
                "window.pluginSetNodeRotation('" +
                this.itemData.exId + "','" +
                this.itemData.rotation + "')");
                this._freshNode();
            },

            onBtnClickNodeHide() {
                this._evalCode("window.pluginSetNodeVisible('" + this.itemData.exId + "', false);");
                this._freshNode();
            },

            onBtnClickNodeShow() {
                this._evalCode("window.pluginSetNodeVisible('" + this.itemData.exId + "', true);");
                this._freshNode();
            },

            _freshNode() {
                let exId = this.itemData.exId;
                this._evalCode("window.getNodeInfo('" + exId + "')");
            },

            _evalCode(code) {
                if (chrome && chrome.devtools) {
                    chrome.devtools.inspectedWindow.eval(code);
                } else {
                    console.log(code);
                }
            },
        },

        props: [
            'itemData'
        ]
    }
</script>

<style scoped>
  span {
    color: #fd942b;
  }

  .myInput {
    width: 90%;
    border-radius: 5px;
    color: #fd942b;
  }
</style>
