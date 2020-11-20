import React from "react";

export default class Loader extends React.Component {
    render() {
        return (
            <svg viewBox="0 0 200 200" width="200" height="200">
                <g>
                    <circle
                        cx="100"
                        cy="100"
                        r="80"
                        stroke="#f1718c"
                        stroke-width="10"
                        fill="transparent"
                        stroke-dasharray="279"
                    />
                    <animateTransform
                        attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="360 100 100"
                        to="0 100 100"
                        dur="1s"
                        additive="sum"
                        repeatCount="indefinite"
                    />
                </g>
            </svg>
        );
    }
}
