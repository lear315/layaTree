<template>
    <div id="node2dinfo">
        <div>
            <ui-prop name="exId">
                <span> {{itemData.exId}}</span>
            </ui-prop>

            <ui-prop name="type">
                <span> {{itemData.type}}</span>
            </ui-prop>

            <ui-prop name="name">
                <span> {{itemData.name}}</span>
            </ui-prop>

            <ui-prop name="Position">
                <div style="float: left;width: 100%;">
                    <ui-prop name="X" style="width: 50%;float: left; cursor: ew-resize;"
                    @movestep="changePositionActionX"
                    step="10">
                    <input class="myInput"
                    @change="changePosition"
                    placeholder="itemData.x"
                    v-model="itemData.x">
                    </ui-prop>

                    <ui-prop name="Y" style="width: 50%;float: left; cursor: ew-resize;"
                    @movestep="changePositionActionY"
                    step="10">
                    <input class="myInput"
                    @change="changePosition"
                    placeholder="itemData.x"
                    v-model="itemData.x">
                    </ui-prop>
                </div>
            </ui-prop>

        </div>
    </div>
</template>