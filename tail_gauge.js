document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------
    // § 1. 要素の取得
    // --------------------------------------------------------------------
    const svgElement = document.getElementById('wavy-gauge-svg');
    const slider = document.getElementById('percentage-slider');
    const textNihonzaru = document.getElementById('text-nihonzaru');
    const textAkagezaru = document.getElementById('text-akagezaru');

    const borderPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    borderPath.id = 'gauge-border';
    fillPath.id = 'gauge-fill';
    svgElement.appendChild(borderPath);
    svgElement.appendChild(fillPath);

    // --------------------------------------------------------------------
    // § 2. 波のアニメーション設定（元の設定を維持）
    // --------------------------------------------------------------------
    const amplitude = 25;
    const frequency = 0.05;
    const travelSpeed = 10;
    const segments = 100;
    let time = 0;

    // --------------------------------------------------------------------
    // § 3. 関数の定義
    // --------------------------------------------------------------------

    /**
     * SVGのパスデータを生成する
     */
    function createWavyPathData(offset) {
        const width = svgElement.clientWidth;
        const height = 100;
        const centerY = height / 2;
        if (width === 0) return "M 0 0";

        const padding = 25;
        const drawableWidth = width - padding * 2;
        let pathData = `M ${padding} ${centerY}`;
        
        const waveStartSegments = 15;

        for (let i = 0; i <= segments; i++) {
            const x = (drawableWidth / segments) * i + padding;
            const waveValue = Math.sin(frequency * (i - travelSpeed * offset));
            const amplitudeRatio = Math.min(1, i / waveStartSegments);
            const amplitudeFactor = 1 - Math.cos((amplitudeRatio * Math.PI) / 2);
            const y = centerY + waveValue * amplitude * amplitudeFactor;
            pathData += ` L ${x} ${y}`;
        }
        return pathData;
    }

    /**
     * ゲージの長さを更新する（元の計算方法を維持）
     */
    function updateGaugeValue(percentage) {
        const pathLength = fillPath.getTotalLength();
        if (pathLength === 0) return;
        const fillLength = pathLength * (percentage / 100);
        const dashArrayValue = `${fillLength} ${pathLength}`;
        fillPath.style.strokeDasharray = dashArrayValue;
    }

    /**
     * テキストの透明度を更新する
     */
    function updateTextOpacity(percentage) {
        const value = percentage / 100;
        textNihonzaru.style.opacity = 1 - value;
        textAkagezaru.style.opacity = value;
    }
    
    // --------------------------------------------------------------------
    // § 4. メインのアニメーションループ
    // --------------------------------------------------------------------
    function animate() {
        time += 0.02;
        if (time > 10000) time = 0;

        const newPathData = createWavyPathData(time);
        fillPath.setAttribute('d', newPathData);
        borderPath.setAttribute('d', newPathData);
        
        updateGaugeValue(slider.value); 
        
        requestAnimationFrame(animate);
    }

    // --------------------------------------------------------------------
    // § 5. イベントリスナーの設定 （★★ここを修正★★）
    // --------------------------------------------------------------------
    slider.addEventListener('input', (event) => {
        // ↓↓↓ ゲージ更新の呼び出しをコメントアウト（無効化）する ↓↓↓
        // updateGaugeValue(event.target.value); 
        updateTextOpacity(event.target.value);
    });

    // --------------------------------------------------------------------
    // § 6. 初期化処理
    // --------------------------------------------------------------------
    updateTextOpacity(slider.value);
    
    borderPath.setAttribute('filter', `url(#rough-texture)`);

    // ページが完全に読み込まれてからアニメーションを開始
    window.addEventListener('load', () => {
        animate();
    });
});