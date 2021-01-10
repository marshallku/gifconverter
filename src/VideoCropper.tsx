import React from "react";
import "./VideoCropper.css";

export default class VideoCroper extends React.Component<
    VideoResizerProps,
    VideoResizerStates
> {
    constructor(props: VideoResizerProps) {
        super(props);

        this.state = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            startPosition: {
                x: 0,
                y: 0,
                orig: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
        };

        window.videoResizer = this;
    }

    handleMouseDown(
        event: React.MouseEvent,
        positionX: string,
        positiony: string
    ) {
        const { top, right, bottom, left } = this.state;
        const startPosition = {
            x: event.clientX,
            y: event.clientY,
            orig: {
                top,
                right,
                bottom,
                left,
            },
        };
        this.setState({
            startPosition,
        });

        this.setResizingMode("mouse", positionX, positiony);
    }

    handleTouchStart(
        event: React.TouchEvent,
        positionX: string,
        positionY: string
    ) {
        const { top, right, bottom, left } = this.state;
        const startPosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
            orig: {
                top,
                right,
                bottom,
                left,
            },
        };
        this.setState({
            startPosition,
        });

        this.setResizingMode("touch", positionX, positionY);
    }

    moveTop = (event: any) => {
        const { startPosition } = this.state;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;

        this.setState({
            top: Math.max(
                startPosition.orig.top + clientY - startPosition.y,
                0
            ),
        });
    };

    moveRight = (event: any) => {
        const { startPosition } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;

        this.setState({
            right: Math.max(
                startPosition.orig.right - clientX + startPosition.x,
                0
            ),
        });
    };

    moveBottom = (event: any) => {
        const { startPosition } = this.state;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;

        this.setState({
            bottom: Math.max(
                startPosition.orig.bottom - clientY + startPosition.y,
                0
            ),
        });
    };

    moveLeft = (event: any) => {
        const { startPosition } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;

        this.setState({
            left: Math.max(
                startPosition.orig.left + clientX - startPosition.x,
                0
            ),
        });
    };

    moveTopLeft = (event: any) => {
        const { startPosition } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;

        this.setState({
            top: Math.max(
                startPosition.orig.top + clientY - startPosition.y,
                0
            ),
            left: Math.max(
                startPosition.orig.left + clientX - startPosition.x,
                0
            ),
        });
    };

    moveTopRight = (event: any) => {
        const { startPosition } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;

        this.setState({
            top: Math.max(
                startPosition.orig.top + clientY - startPosition.y,
                0
            ),
            right: Math.max(
                startPosition.orig.right - clientX + startPosition.x,
                0
            ),
        });
    };

    moveBottomLeft = (event: any) => {
        const { startPosition } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;

        this.setState({
            bottom: Math.max(
                startPosition.orig.bottom - clientY + startPosition.y,
                0
            ),
            left: Math.max(
                startPosition.orig.left + clientX - startPosition.x,
                0
            ),
        });
    };

    moveBottomRight = (event: any) => {
        const { startPosition } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;

        this.setState({
            bottom: Math.max(
                startPosition.orig.bottom - clientY + startPosition.y,
                0
            ),
            right: Math.max(
                startPosition.orig.right - clientX + startPosition.x,
                0
            ),
        });
    };

    updateOption() {
        const { top, right, bottom, left } = this.state;

        this.props.setSize({ top, right, bottom, left });
    }

    setResizingMode(
        type: "touch" | "mouse",
        positionY: string,
        positionX: string
    ) {
        if (positionX === "c" || positionY === "c") {
            const resizeFunction =
                positionY === "c"
                    ? positionX === "l"
                        ? this.moveLeft
                        : this.moveRight
                    : positionY === "t"
                    ? this.moveTop
                    : this.moveBottom;

            if (type === "touch") {
                document.addEventListener("touchmove", resizeFunction, {
                    passive: true,
                });

                document.addEventListener(
                    "touchend",
                    () => {
                        document.removeEventListener(
                            "touchmove",
                            resizeFunction
                        );
                        this.updateOption();
                    },
                    { once: true }
                );
            } else {
                document.addEventListener("mousemove", resizeFunction, {
                    passive: true,
                });

                document.addEventListener(
                    "mouseup",
                    () => {
                        document.removeEventListener(
                            "mousemove",
                            resizeFunction
                        );
                        this.updateOption();
                    },
                    { once: true }
                );
            }
        } else {
            const resizeFunction =
                positionY === "t"
                    ? positionX === "l"
                        ? this.moveTopLeft
                        : this.moveTopRight
                    : positionX === "l"
                    ? this.moveBottomLeft
                    : this.moveBottomRight;

            if (type === "touch") {
                document.addEventListener("touchmove", resizeFunction, {
                    passive: true,
                });

                document.addEventListener(
                    "touchend",
                    () => {
                        document.removeEventListener(
                            "touchmove",
                            resizeFunction
                        );
                        this.updateOption();
                    },
                    { once: true }
                );
            } else {
                document.addEventListener("mousemove", resizeFunction, {
                    passive: true,
                });

                document.addEventListener(
                    "mouseup",
                    () => {
                        document.removeEventListener(
                            "mousemove",
                            resizeFunction
                        );
                        this.updateOption();
                    },
                    { once: true }
                );
            }
        }
    }

    render() {
        const { top, right, bottom, left } = this.state;

        return (
            <div
                className="option__resize"
                style={{
                    top: `${top}px`,
                    right: `${right}px`,
                    bottom: `${bottom}px`,
                    left: `${left}px`,
                }}
            >
                <div
                    className="optin__resize__point option__resize__point--top--left"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "t", "l");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "t", "l");
                    }}
                ></div>
                <div
                    className="optin__resize__point option__resize__point--top--center"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "t", "c");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "t", "c");
                    }}
                ></div>
                <div
                    className="optin__resize__point option__resize__point--top--right"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "t", "r");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "t", "r");
                    }}
                ></div>
                <div
                    className="optin__resize__point option__resize__point--center--left"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "c", "l");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "c", "l");
                    }}
                ></div>
                <div
                    className="optin__resize__point option__resize__point--center--right"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "c", "r");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "c", "r");
                    }}
                ></div>
                <div
                    className="optin__resize__point option__resize__point--bottom--left"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "b", "l");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "b", "l");
                    }}
                ></div>
                <div
                    className="optin__resize__point option__resize__point--bottom--center"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "b", "c");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "b", "c");
                    }}
                ></div>
                <div
                    className="optin__resize__point option__resize__point--bottom--right"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "b", "r");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "b", "r");
                    }}
                ></div>
            </div>
        );
    }
}
