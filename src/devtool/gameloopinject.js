// 注入脚本的代码
export default function () {
    // 检测是否包含Laya变量
    var isLayaGame = true;
    try {
        var layaGame = Laya;
    } catch (e) {
        isLayaGame = false;
    }


    if (isLayaGame) {
        // laya 暂停状态
        window.layaStatePause = false;

        // laya 需要单步次数
        window.layaStepCount = 0;

        let rawRequestAnimationFrame = window.requestAnimationFrame;

        let renderRec = null;

        function loopCheck(stamp) {
            if (renderRec != null) {
                window.requestAnimationFrame(renderRec);
            }
        }

        window.requestAnimationFrame = function (render) {
            if (renderRec == null) {
                renderRec = render;
            }

            if (window.layaStatePause) {
                if ( window.layaStepCount > 0) {
                    window.layaStepCount -= 1;
                    rawRequestAnimationFrame(renderRec);
                } else {
                    rawRequestAnimationFrame(loopCheck);
                }
            } else {
                rawRequestAnimationFrame(renderRec);
            }
        };
    }
}
