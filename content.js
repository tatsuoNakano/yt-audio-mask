(function () {
    // すでに実行済みなら何もしない
    if (window.__ytVideoMaskInitialized) return;
    window.__ytVideoMaskInitialized = true;

    // スタイルを追加（マスク用 & トグルボタン用）
    const style = document.createElement("style");
    style.textContent = `
    /* 動画プレイヤー全体を覆うマスク */
    .ytvm-mask-overlay {
      position: absolute;
      inset: 0;
      background: #000;
      z-index: 99998;
      pointer-events: none; /* クリックはプレイヤーに通す */
    }

    /* プレイヤーを相対位置にしておく */
    .ytvm-masked-player {
      position: relative !important;
    }

    /* トグルボタン */
    .ytvm-toggle-btn {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 99999;
      padding: 8px 12px;
      border-radius: 9999px;
      border: none;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .ytvm-toggle-btn.ytvm-off {
      background: rgba(150, 0, 0, 0.8);
    }
  `;
    document.head.appendChild(style);

    // プレイヤーにマスクをかぶせる処理
    function applyMask() {
        // メインの動画プレイヤーDOMを探す
        const player =
            document.getElementById("movie_player") ||
            document.querySelector(".html5-video-player");

        if (!player || player.__ytvmMasked) return;

        player.classList.add("ytvm-masked-player");

        const overlay = document.createElement("div");
        overlay.className = "ytvm-mask-overlay";

        player.appendChild(overlay);
        player.__ytvmMasked = true;
    }

    // マスクを外す処理
    function removeMask() {
        const player =
            document.getElementById("movie_player") ||
            document.querySelector(".html5-video-player");

        if (!player || !player.__ytvmMasked) return;

        const overlay = player.querySelector(".ytvm-mask-overlay");
        if (overlay) {
            overlay.remove();
        }
        player.classList.remove("ytvm-masked-player");
        player.__ytvmMasked = false;
    }

    // トグルボタンを作成（最初はマスクON）
    const btn = document.createElement("button");
    btn.textContent = "Video Mask: ON";
    btn.className = "ytvm-toggle-btn";
    document.body.appendChild(btn);

    let enabled = true;
    applyMask();

    btn.addEventListener("click", () => {
        enabled = !enabled;
        if (enabled) {
            applyMask();
            btn.textContent = "Video Mask: ON";
            btn.classList.remove("ytvm-off");
        } else {
            removeMask();
            btn.textContent = "Video Mask: OFF";
            btn.classList.add("ytvm-off");
        }
    });

    // YouTubeはSPAなので、URL変化のたびにマスクを貼り直す
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            // 新しい動画ページになったとき再適用
            if (enabled) {
                setTimeout(applyMask, 1000); // DOMが落ち着くまで少し待つ
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
