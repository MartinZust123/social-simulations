import { useState, useEffect } from 'react';

function RGBDemo() {
  const [demoF, setDemoF] = useState(3);
  const [demoQ, setDemoQ] = useState(6);
  const [demoFeatures, setDemoFeatures] = useState([2, 4, 1]);

  const randomizeDemoFeatures = () => {
    const features = Array.from({ length: demoF }, () => Math.floor(Math.random() * demoQ));
    setDemoFeatures(features);
  };

  useEffect(() => {
    const currentLength = demoFeatures.length;
    if (demoF > currentLength) {
      const newFeatures = [...demoFeatures];
      for (let i = currentLength; i < demoF; i++) {
        newFeatures.push(Math.floor(Math.random() * demoQ));
      }
      setDemoFeatures(newFeatures);
    } else if (demoF < currentLength) {
      setDemoFeatures(demoFeatures.slice(0, demoF));
    }
  }, [demoF]);

  const getDemoColor = () => {
    let r, g, b;

    if (demoF === 1) {
      r = Math.floor((demoFeatures[0] / (demoQ - 1)) * 255);
      g = 128;
      b = 128;
    } else if (demoF === 2) {
      r = Math.floor((demoFeatures[0] / (demoQ - 1)) * 255);
      g = Math.floor((demoFeatures[1] / (demoQ - 1)) * 255);
      b = 128;
    } else {
      const avgR = demoFeatures.filter((_, i) => i % 3 === 0).reduce((sum, val) => sum + val, 0) / demoFeatures.filter((_, i) => i % 3 === 0).length;
      const avgG = demoFeatures.filter((_, i) => i % 3 === 1).reduce((sum, val) => sum + val, 0) / demoFeatures.filter((_, i) => i % 3 === 1).length;
      const avgB = demoFeatures.filter((_, i) => i % 3 === 2).reduce((sum, val) => sum + val, 0) / demoFeatures.filter((_, i) => i % 3 === 2).length;

      r = Math.floor((avgR / (demoQ - 1)) * 255);
      g = Math.floor((avgG / (demoQ - 1)) * 255);
      b = Math.floor((avgB / (demoQ - 1)) * 255);
    }

    return { r, g, b, color: `rgb(${r}, ${g}, ${b})` };
  };

  const demoColor = getDemoColor();

  return (
    <div className="math-section">
      <h2 className="math-heading">RGB Color Mapping - Interactive Demo</h2>
      <p className="math-text">
        Each agent's culture is visualized using RGB colors, where cultural features map to color channels.
        Try adjusting F and q to see how the color mapping works:
      </p>

      <div className="demo-controls">
        <div className="demo-control-group">
          <label className="control-label">
            F (Cultural Features): <span className="grid-size-value">{demoF}</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={demoF}
            onChange={(e) => setDemoF(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="demo-control-group">
          <label className="control-label">
            q (Possible States): <span className="grid-size-value">{demoQ}</span>
          </label>
          <input
            type="range"
            min="2"
            max="20"
            value={demoQ}
            onChange={(e) => setDemoQ(Number(e.target.value))}
            className="slider"
          />
        </div>

        <button className="randomize-button" onClick={randomizeDemoFeatures}>
          Randomize
        </button>
      </div>

      <div className="demo-visualization">
        <div className="demo-features">
          <h3 className="demo-subtitle">Feature Values</h3>
          <div className="feature-values">
            {demoFeatures.map((value, index) => {
              let colorClass = '';
              if (demoF >= 3) {
                if (index % 3 === 0) colorClass = 'red-tint';
                else if (index % 3 === 1) colorClass = 'green-tint';
                else colorClass = 'blue-tint';
              }
              return (
                <div key={index} className={`feature-value-item ${colorClass}`}>
                  <span className="feature-label">Feature {index}:</span>
                  <span className="feature-value">{value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="demo-calculation">
          <h3 className="demo-subtitle">RGB Calculation</h3>
          <div className="rgb-calculations">
            {demoF === 1 && (
              <>
                <div className="rgb-calc-item red-tint">
                  <strong>R:</strong> {demoFeatures[0]} / {demoQ - 1} × 255 = {demoColor.r}
                </div>
                <div className="rgb-calc-item green-tint">
                  <strong>G:</strong> 128 (fixed)
                </div>
                <div className="rgb-calc-item blue-tint">
                  <strong>B:</strong> 128 (fixed)
                </div>
              </>
            )}
            {demoF === 2 && (
              <>
                <div className="rgb-calc-item red-tint">
                  <strong>R:</strong> {demoFeatures[0]} / {demoQ - 1} × 255 = {demoColor.r}
                </div>
                <div className="rgb-calc-item green-tint">
                  <strong>G:</strong> {demoFeatures[1]} / {demoQ - 1} × 255 = {demoColor.g}
                </div>
                <div className="rgb-calc-item blue-tint">
                  <strong>B:</strong> 128 (fixed)
                </div>
              </>
            )}
            {demoF >= 3 && (
              <>
                <div className="rgb-calc-item red-tint">
                  <strong>R:</strong> avg({demoFeatures.filter((_, i) => i % 3 === 0).join(', ')}) / {demoQ - 1} × 255 = {demoColor.r}
                </div>
                <div className="rgb-calc-item green-tint">
                  <strong>G:</strong> avg({demoFeatures.filter((_, i) => i % 3 === 1).join(', ')}) / {demoQ - 1} × 255 = {demoColor.g}
                </div>
                <div className="rgb-calc-item blue-tint">
                  <strong>B:</strong> avg({demoFeatures.filter((_, i) => i % 3 === 2).join(', ')}) / {demoQ - 1} × 255 = {demoColor.b}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="demo-result">
          <h3 className="demo-subtitle">Result</h3>
          <div
            className="demo-color-circle"
            style={{background: demoColor.color}}
          ></div>
          <div className="demo-rgb-value">
            rgb({demoColor.r}, {demoColor.g}, {demoColor.b})
          </div>
        </div>
      </div>
    </div>
  );
}

export default RGBDemo;
