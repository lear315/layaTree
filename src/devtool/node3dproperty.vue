<template>
    <div id="node3dinfo">
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
                    <uiprop name="X" style="width: 33%;float: left; cursor: ew-resize;"
                    @movestep="changePositionLocalX"
                    step="0.02">
                        <input class="myInput"
                        @change="changePosition"
                        placeholder="itemData.x"
                        v-model="itemData.x">
                    </uiprop>

                    <uiprop name="Y" style="width: 33%;float: left; cursor: ew-resize;"
                    @movestep="changePositionLocalY"
                    step="0.02">
                        <input class="myInput"
                        @change="changePosition"
                        placeholder="itemData.y"
                        v-model="itemData.y">
                    </uiprop>

                    <uiprop name="Z" style="width: 34%;float: left; cursor: ew-resize;"
                    @movestep="changePositionLocalZ"
                    step="0.02">
                        <input class="myInput"
                        @change="changePosition"
                        placeholder="itemData.z"
                        v-model="itemData.z">
                    </uiprop>
                </div>
            </uiprop>

            <uiprop name="Rotation">
                <div style="float: left;width: 100%;">
                    <uiprop name="X" style="width: 33%;float: left; cursor: ew-resize;"
                    @movestep="changeRotationX"
                    step="1">
                        <input class="myInput"
                        @change="changeRotation"
                        placeholder="itemData.rotationX"
                        v-model="itemData.rotationX">
                    </uiprop>

                    <uiprop name="Y" style="width: 33%;float: left; cursor: ew-resize;"
                    @movestep="changeRotationY"
                    step="1">
                        <input class="myInput"
                        @change="changeRotation"
                        placeholder="itemData.rotationY"
                        v-model="itemData.rotationY">
                    </uiprop>

                    <uiprop name="Z" style="width: 34%;float: left; cursor: ew-resize;"
                    @movestep="changeRotationZ"
                    step="1">
                        <input class="myInput"
                        @change="changeRotation"
                        placeholder="itemData.rotationZ"
                        v-model="itemData.rotationZ">
                    </uiprop>
                </div>
            </uiprop>

            <uiprop name="Scale">
                <div style="float: left;width: 100%;">
                    <uiprop name="X" style="width: 33%;float: left; cursor: ew-resize;"
                    @movestep="changeScaleX"
                    step="0.1">
                        <input class="myInput"
                        @change="changeScale"
                        placeholder="itemData.scaleX"
                        v-model="itemData.scaleX">
                    </uiprop>

                    <uiprop name="Y" style="width: 33%;float: left; cursor: ew-resize;"
                    @movestep="changeScaleY"
                    step="0.1">
                        <input class="myInput"
                        @change="changeScale"
                        placeholder="itemData.scaleY"
                        v-model="itemData.scaleY">
                    </uiprop>

                    <uiprop name="Z" style="width: 34%;float: left; cursor: ew-resize;"
                    @movestep="changeScaleZ"
                    step="0.1">
                        <input class="myInput"
                        @change="changeScale"
                        placeholder="itemData.scaleZ"
                        v-model="itemData.scaleZ">
                    </uiprop>
                </div>
            </uiprop>

            <uiprop name="active">
                <p v-if="itemData.active" style="margin: 0;display: flex;align-items: center;flex-wrap: wrap;">
                    <input type="checkbox"
                        style="width: 20px;height: 20px;"
                        :checked="itemData.active"
                        @click="onBtnClickNodeHide">
                    隐藏节点
                </p>

                <p v-if="!itemData.active" style="margin: 0;display: flex;align-items: center;flex-wrap: wrap;">
                    <input type="checkbox"
                        style="width: 20px;height: 20px;"
                        :checked="itemData.active"
                        @click="onBtnClickNodeShow"
                    >
                    显示节点
                </p>
            </uiprop>

        </div>
    </div>
</template>

<script>
    export default {
        name: "node3dinfo",

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

            changePositionLocalX(step) {
                let x = parseFloat(this.itemData.x);
                this.itemData.x = x + step;
                this.changePosition();
            },

            changePositionLocalY(step) {
                let y = parseFloat(this.itemData.y);
                this.itemData.y = y + step;
                this.changePosition();
            },

            changePositionLocalZ(step) {
                let z = parseFloat(this.itemData.z);
                this.itemData.z = z + step;
                this.changePosition();
            },

            changeRotationX(step) {
                let rotationX = parseFloat(this.itemData.rotationX);
                this.itemData.rotationX = rotationX + step;
                this.changeRotation();
            },

            changeRotationY(step) {
                let rotationY = parseFloat(this.itemData.rotationY);
                this.itemData.rotationY = rotationY + step;
                this.changeRotation();
            },

            changeRotationZ(step) {
                let rotationZ = parseFloat(this.itemData.rotationZ);
                this.itemData.rotationZ = rotationZ + step;
                this.changeRotation();
            },

            changeScaleX(step) {
                let scaleX = parseFloat(this.itemData.scaleX);
                this.itemData.scaleX = scaleX + step;
                if (this.itemData.scaleX <= 0) {
                    this.itemData.scaleX = 0;
                }
                this.changeScale();
            },

            changeScaleY(step) {
                let scaleY = parseFloat(this.itemData.scaleY);
                this.itemData.scaleY = scaleY + step;
                if (this.itemData.scaleY <= 0) {
                    this.itemData.scaleY = 0;
                }
                this.changeScale();
            },

            changeScaleZ(step) {
                let scaleZ = parseFloat(this.itemData.scaleZ);
                this.itemData.scaleZ = scaleZ + step;
                if (this.itemData.scaleZ <= 0) {
                    this.itemData.scaleZ = 0;
                }
                this.changeScale();
            },

            changePosition() {
                this._evalCode(
                    "window.pluginSetNodePosition3D(" +
                    "'" + this.itemData.exId + "'," +
                    "'" + this.itemData.x + "'," +
                    "'" + this.itemData.y + "'," +
                    "'" + this.itemData.z + "'" +
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
                "window.pluginSetNodeRotation3D(" +
                "'" + this.itemData.exId + "'," +
                "'" + this.itemData.rotationX + "'," +
                "'" + this.itemData.rotationY + "'," +
                "'" + this.itemData.rotationZ + "'" +
                ")");
                this._freshNode();
            },

            changeScale() {
                this._evalCode(
                "window.pluginSetNodeScale3D(" +
                "'" + this.itemData.exId + "'," +
                "'" + this.itemData.scaleX + "'," +
                "'" + this.itemData.scaleY + "'," +
                "'" + this.itemData.scaleZ + "'" +
                ")");
                this._freshNode();
            },

            onBtnClickNodeHide() {
                this._evalCode("window.pluginSetNodeActive('" + this.itemData.exId + "', 0);");
                this._freshNode();
            },

            onBtnClickNodeShow() {
                this._evalCode("window.pluginSetNodeActive('" + this.itemData.exId + "', 1);");
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
