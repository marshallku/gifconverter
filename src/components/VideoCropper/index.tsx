import { Component, MouseEvent, TouchEvent } from "react";
import { useOption } from "@store";
import "./index.css";

export default class VideoCropper extends Component<
    VideoCropperProps,
    VideoCropperStates
> {
    startPosition: {
        x: number;
        y: number;
        orig: Size;
    };
    constructor(props: VideoCropperProps) {
        super(props);

        this.state = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            video: {
                width: this.props.video.offsetWidth,
                height: this.props.video.offsetHeight,
            },
        };

        this.startPosition = {
            x: 0,
            y: 0,
            orig: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        };
    }

    componentDidMount = () => {
        this.updateVideoSize();
    };

    updateVideoSize() {
        // Add delays to load it after css applied
        setTimeout(() => {
            this.setState({
                video: {
                    width: this.props.video.offsetWidth,
                    height: this.props.video.offsetHeight,
                },
            });
        }, 100);
    }

    handleMouseDown(event: MouseEvent, positionX: string, positionY: string) {
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

        this.startPosition = startPosition;
        this.setResizingMode("mouse", positionX, positionY);
    }

    handleTouchStart(event: TouchEvent, positionX: string, positionY: string) {
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

        this.startPosition = startPosition;
        this.setResizingMode("touch", positionX, positionY);
    }

    resizeTop = (event: any) => {
        const { startPosition } = this;
        const { video } = this.state;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;
        const newTop = startPosition.orig.top + clientY - startPosition.y;

        if (video.height - startPosition.orig.bottom - 10 <= newTop) return;

        this.setState({
            top: Math.max(newTop, 0),
        });
    };

    resizeRight = (event: any) => {
        const { startPosition } = this;
        const { video } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const newRight = startPosition.orig.right - clientX + startPosition.x;

        if (video.width - startPosition.orig.left - 10 <= newRight) return;

        this.setState({
            right: Math.max(newRight, 0),
        });
    };

    resizeBottom = (event: any) => {
        const { startPosition } = this;
        const { video } = this.state;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;
        const newBottom = startPosition.orig.bottom - clientY + startPosition.y;

        if (video.height - startPosition.orig.top - 10 <= newBottom) return;

        this.setState({
            bottom: Math.max(newBottom, 0),
        });
    };

    resizeLeft = (event: any) => {
        const { startPosition } = this;
        const { video } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const newLeft = startPosition.orig.left + clientX - startPosition.x;

        if (video.width - startPosition.orig.right - 10 <= newLeft) return;

        this.setState({
            left: Math.max(newLeft, 0),
        });
    };

    resizeTopLeft = (event: any) => {
        const { startPosition } = this;
        const { video } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;

        this.setState({
            top: Math.min(
                video.height - startPosition.orig.bottom - 10,
                Math.max(startPosition.orig.top + clientY - startPosition.y, 0)
            ),
            left: Math.min(
                video.width - startPosition.orig.right - 10,
                Math.max(startPosition.orig.left + clientX - startPosition.x, 0)
            ),
        });
    };

    resizeTopRight = (event: any) => {
        const { startPosition } = this;
        const { video } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;

        this.setState({
            top: Math.min(
                video.height - startPosition.orig.bottom - 10,
                Math.max(startPosition.orig.top + clientY - startPosition.y, 0)
            ),
            right: Math.min(
                video.width - startPosition.orig.left - 10,
                Math.max(
                    startPosition.orig.right - clientX + startPosition.x,
                    0
                )
            ),
        });
    };

    resizeBottomLeft = (event: any) => {
        const { startPosition } = this;
        const { video } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;

        this.setState({
            bottom: Math.min(
                video.height - startPosition.orig.top - 10,
                Math.max(
                    startPosition.orig.bottom - clientY + startPosition.y,
                    0
                )
            ),
            left: Math.min(
                video.width - startPosition.orig.right - 10,
                Math.max(startPosition.orig.left + clientX - startPosition.x, 0)
            ),
        });
    };

    resizeBottomRight = (event: any) => {
        const { startPosition } = this;
        const { video } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;

        this.setState({
            bottom: Math.min(
                video.height - startPosition.orig.top - 10,
                Math.max(
                    startPosition.orig.bottom - clientY + startPosition.y,
                    0
                )
            ),
            right: Math.min(
                video.width - startPosition.orig.left - 10,
                Math.max(
                    startPosition.orig.right - clientX + startPosition.x,
                    0
                )
            ),
        });
    };

    addResizeEvent(
        type: "touch" | "mouse",
        eventListener: (event: any) => void
    ) {
        if (type === "touch") {
            document.addEventListener("touchmove", eventListener, {
                passive: true,
            });

            document.addEventListener(
                "touchend",
                () => {
                    document.removeEventListener("touchmove", eventListener);
                    this.updateOption();
                },
                { once: true }
            );
        } else {
            document.addEventListener("mousemove", eventListener, {
                passive: true,
            });

            document.addEventListener(
                "mouseup",
                () => {
                    document.removeEventListener("mousemove", eventListener);
                    this.updateOption();
                },
                { once: true }
            );
        }
    }

    setResizingMode(
        type: "touch" | "mouse",
        positionY: string,
        positionX: string
    ) {
        if (positionX === "c" || positionY === "c") {
            if (positionY === "c") {
                if (positionX === "l") {
                    this.addResizeEvent(type, this.resizeLeft);
                } else {
                    this.addResizeEvent(type, this.resizeRight);
                }
            } else if (positionY === "t") {
                this.addResizeEvent(type, this.resizeTop);
            } else {
                this.addResizeEvent(type, this.resizeBottom);
            }
        } else {
            if (positionY === "t") {
                if (positionX === "l") {
                    this.addResizeEvent(type, this.resizeTopLeft);
                } else {
                    this.addResizeEvent(type, this.resizeTopRight);
                }
            } else if (positionX === "l") {
                this.addResizeEvent(type, this.resizeBottomLeft);
            } else {
                this.addResizeEvent(type, this.resizeBottomRight);
            }
        }
    }

    moveBox = (event: any) => {
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;
        const { startPosition } = this;

        const xDiff = startPosition.x - clientX;
        const yDiff = startPosition.y - clientY;
        const xMax = startPosition.orig.right + startPosition.orig.left;
        const yMax = startPosition.orig.top + startPosition.orig.bottom;

        this.setState({
            top: Math.min(yMax, Math.max(startPosition.orig.top - yDiff, 0)),
            left: Math.min(xMax, Math.max(startPosition.orig.left - xDiff, 0)),
            bottom: Math.min(
                yMax,
                Math.max(startPosition.orig.bottom + yDiff, 0)
            ),
            right: Math.min(
                xMax,
                Math.max(startPosition.orig.right + xDiff, 0)
            ),
        });
    };

    handleMove = (event: any) => {
        const { top, right, bottom, left } = this.state;
        const clientX = event.touches
            ? event.touches[0].clientX
            : event.clientX;
        const clientY = event.touches
            ? event.touches[0].clientY
            : event.clientY;
        const startPosition = {
            x: clientX,
            y: clientY,
            orig: {
                top,
                right,
                bottom,
                left,
            },
        };
        this.startPosition = startPosition;

        const {
            nativeEvent: { type: eventType },
        } = event;

        if (eventType.includes("touch")) {
            document.addEventListener("touchmove", this.moveBox, {
                passive: true,
            });

            document.addEventListener(
                "touchend",
                () => {
                    document.removeEventListener("touchmove", this.moveBox);
                    this.updateOption();
                },
                { once: true }
            );
        } else if (eventType.includes("mouse")) {
            document.addEventListener("mousemove", this.moveBox, {
                passive: true,
            });

            document.addEventListener(
                "mouseup",
                () => {
                    document.removeEventListener("mousemove", this.moveBox);
                    this.updateOption();
                },
                { once: true }
            );
        }
    };

    updateOption() {
        const { top, right, bottom, left } = this.state;
        const { setSize } = useOption.getState();

        setSize({ top, right, bottom, left });
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
                    className="option__resize__move"
                    onMouseDown={this.handleMove}
                    onTouchStart={this.handleMove}
                />
                <div
                    className="option__resize__point option__resize__point--top--left"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "t", "l");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "t", "l");
                    }}
                />
                <div
                    className="option__resize__point option__resize__point--top--center"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "t", "c");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "t", "c");
                    }}
                />
                <div
                    className="option__resize__point option__resize__point--top--right"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "t", "r");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "t", "r");
                    }}
                />
                <div
                    className="option__resize__point option__resize__point--center--left"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "c", "l");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "c", "l");
                    }}
                />
                <div
                    className="option__resize__point option__resize__point--center--right"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "c", "r");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "c", "r");
                    }}
                />
                <div
                    className="option__resize__point option__resize__point--bottom--left"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "b", "l");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "b", "l");
                    }}
                />
                <div
                    className="option__resize__point option__resize__point--bottom--center"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "b", "c");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "b", "c");
                    }}
                />
                <div
                    className="option__resize__point option__resize__point--bottom--right"
                    onMouseDown={(event) => {
                        this.handleMouseDown(event, "b", "r");
                    }}
                    onTouchStart={(event) => {
                        this.handleTouchStart(event, "b", "r");
                    }}
                />
            </div>
        );
    }
}
