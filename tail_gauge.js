document.addEventListener('DOMContentLoaded', () => {
    
    const svgElement = document.getElementById('wavy-gauge-svg');
    const slider = document.getElementById('percentage-slider');
    const borderPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    borderPath.id = 'gauge-border';
    fillPath.id = 'gauge-fill';
    svgElement.appendChild(borderPath);
    svgElement.appendChild(fillPath);

    // ★★★ ここから新しい調整項目 ★★★
    const amplitude = 25;      // 波の大きさ（揺れ幅）
    const frequency = 0.05;    // 波の細かさ（数値が小さいと波が伸びる）
    const travelSpeed = 10;    // 波が伝わる速さ
    // ★★★ ここまで ★★★

    const segments = 100;
    let time = 0;

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
            
            // ★★★ ここから計算式を刷新 ★★★

            // 1. 物理的に正しい「伝わる波」を計算します
            //    sin( 波の細かさ * (場所 - 速度 * 時間) )
            const waveValue = Math.sin(frequency * (i - travelSpeed * offset));
            
            // 2. 根元の関節を消すための「揺れ幅の調整係数」を計算します
            const amplitudeRatio = Math.min(1, i / waveStartSegments);
            const amplitudeFactor = 1 - Math.cos((amplitudeRatio * Math.PI) / 2);

            // 3. 「伝わる波」に「調整係数」と「全体の大きさ」を掛け合わせ、最終的な高さを決定します
            const y = centerY + waveValue * amplitude * amplitudeFactor;

            // ★★★ ここまで ★★★
            
            pathData += ` L ${x} ${y}`;
        }
        return pathData;
    }

    function updateGaugeValue(percentage) {
        const pathLength = fillPath.getTotalLength();
        if (pathLength === 0) return;
        const fillLength = pathLength * (percentage / 100);
        const dashArrayValue = `${fillLength} ${pathLength}`;
        fillPath.style.strokeDasharray = dashArrayValue;
    }

    borderPath.setAttribute('filter', `url(#rough-texture)`);
    fillPath.style.strokeDashoffset = 0;

    function animate() {
        // 時間を一定のペースで進める
        time += 0.02;
        if (time > 10000) time = 0;

        const newPathData = createWavyPathData(time);
        fillPath.setAttribute('d', newPathData);
        borderPath.setAttribute('d', newPathData);
        updateGaugeValue(slider.value);
        requestAnimationFrame(animate);
    }

    slider.addEventListener('input', (event) => {
        updateGaugeValue(event.target.value);
    });
document.addEventListener('DOMContentLoaded', () => {
    
    const svgElement = document.getElementById('wavy-gauge-svg');
    const slider = document.getElementById('percentage-slider');
    const borderPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const fillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    borderPath.id = 'gauge-border';
    fillPath.id = 'gauge-fill';
    svgElement.appendChild(borderPath);
    svgElement.appendChild(fillPath);

    // ★★★ ここから新しい調整項目 ★★★
    const amplitude = 25;           // 波の大きさ（揺れ幅）
    const oscillationSpeed = 4;     // 根元で生まれる振動の速さ
    const propagationSpeed = 0.3;   // 波が伝わる速さ（0.1～0.9程度）
    // ★★★ ここまで ★★★

    const segments = 100;
    let time = 0;

    // 各セグメントのY座標のずれを保存する配列
    let yOffsets = new Array(segments + 1).fill(0);

    // 物理シミュレーション用の配列
    let yVelocities = new Array(segments + 1).fill(0);

    function createWavyPathData() {
        const width = svgElement.clientWidth;
        const height = 100;
        const centerY = height / 2;

        if (width === 0) return "M 0 0";

        const padding = 25;
        const drawableWidth = width - padding * 2;
        let pathData = `M ${padding} ${centerY}`;
        
        for (let i = 0; i <= segments; i++) {
            const x = (drawableWidth / segments) * i + padding;
            // 配列からY座標のずれを取得して描画
            const y = centerY + yOffsets[i];
            pathData += ` L ${x} ${y}`;
        }
        return pathData;
    }
    
    function updateWaveSimulation() {
        // 1. 波の発生源（根元の少し先）を時間経過で振動させる
        const sourceIndex = 1; // 0は完全に固定
        yOffsets[sourceIndex] = Math.sin(time) * amplitude;

        // 2. バネの物理演算で波を伝播させる
        const tension = 0.025; // 波の硬さ
        const damping = 0.025; // 波の減衰しやすさ

        for (let i = 0; i <= segments; i++) {
            if (i === 0 || i === sourceIndex) continue; // 発生源と端は固定

            const prev = yOffsets[i - 1] || 0;
            const next = yOffsets[i + 1] || 0;
            const current = yOffsets[i];

            // フックの法則（F = -kx）に基づいて、隣の点からの力を計算
            const force = tension * (prev + next - 2 * current);

            // 加速度を計算し、速度を更新（空気抵抗も考慮）
            yVelocities[i] += force;
            yVelocities[i] *= (1 - damping);
        }

        // 3. 速度に基づいて各点の位置を更新
        for (let i = 0; i <= segments; i++) {
            if (i === 0 || i === sourceIndex) continue;
            yOffsets[i] += yVelocities[i];
        }
    }

    function updateGaugeValue(percentage) {
        const pathLength = fillPath.getTotalLength();
        if (pathLength === 0) return;
        const fillLength = pathLength * (percentage / 100);
        const dashArrayValue = `${fillLength} ${pathLength}`;
        fillPath.style.strokeDasharray = dashArrayValue;
    }

    borderPath.setAttribute('filter', `url(#rough-texture)`);
    fillPath.style.strokeDashoffset = 0;

    function animate() {
        time += 0.02 * oscillationSpeed; // 時間を振動の速さに応じて進める
        
        // 波のシミュレーションを更新
        updateWaveSimulation();
        
        // シミュレーション結果を描画
        const newPathData = createWavyPathData();
        fillPath.setAttribute('d', newPathData);
        borderPath.setAttribute('d', newPathData);
        updateGaugeValue(slider.value);
        requestAnimationFrame(animate);
    }

    slider.addEventListener('input', (event) => {
        updateGaugeValue(event.target.value);
    });

    window.addEventListener('load', () => {
        animate();
    });
});
    window.addEventListener('load', () => {
        animate();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // スライダーとテキスト要素を取得
    const slider = document.getElementById('percentage-slider');
    const textNihonzaru = document.getElementById('text-nihonzaru');
    const textAkagezaru = document.getElementById('text-akagezaru');

    // テキストの透明度を更新する関数
    function updateTextOpacity(percentage) {
        // ゲージの値（0～100）を0～1の範囲に変換
        const value = percentage / 100;

        // ニホンザル：値が0(最小)のとき不透明(1)、1(最大)のとき透明(0)
        textNihonzaru.style.opacity = 1 - value;

        // アカゲザル：値が0(最小)のとき透明(0)、1(最大)のとき不透明(1)
        textAkagezaru.style.opacity = value;
    }

    // スライダーが動かされたときに関数を呼び出す
    slider.addEventListener('input', (event) => {
        updateTextOpacity(event.target.value);
    });

    // ページ読み込み時にも一度、初期値で実行する
    updateTextOpacity(slider.value);
});