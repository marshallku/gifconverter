import { useProgress } from "@store";
import "./index.css";

export default function DisplayProgress() {
    const { progress } = useProgress();

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
                    strokeDashoffset={`${502 - Math.round(progress * 502)}`}
                />
            </svg>
            <div>{Math.round(progress * 100)} %</div>
        </div>
    );
}
