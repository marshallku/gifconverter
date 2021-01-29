import React, { useState } from "react";
import Loader from "./Loader";
import "./DisplayProgress.css";

export default function DisplayProgress() {
    const [ratio, setRatio] = useState<number>(0);

    window.setRatio = setRatio;

    return (
        <div className="progress">
            <Loader />
            <div>{Math.round(ratio * 100)} %</div>
        </div>
    );
}
