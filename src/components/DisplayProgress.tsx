import { useState } from "react";
import "./DisplayProgress.css";

export default function DisplayProgress() {
    const [ratio, setRatio] = useState<number>(0);

    window.setRatio = setRatio;

    return (
        <div className="progress">
            <svg viewBox="0 0 200 200" width="200" height="200">
                <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="#f1718c"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="502"
                    strokeDashoffset={`${502 - Math.round(ratio * 502)}`}
                />
            </svg>
            <div>{Math.round(ratio * 100)} %</div>
        </div>
    );
}
