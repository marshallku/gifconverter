import React from "../web_modules/react.js";
import "./VideoCropper.css.proxy.js";
export default class VideoCroper extends React.Component {
  constructor(props) {
    super(props);
    this.componentDidMount = () => {
      this.updateVideoSize();
    };
    this.resizeTop = (event) => {
      const {startPosition} = this;
      const {video} = this.state;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      const newTop = startPosition.orig.top + clientY - startPosition.y;
      if (video.height - startPosition.orig.bottom - 10 <= newTop)
        return;
      this.setState({
        top: Math.max(newTop, 0)
      });
    };
    this.resizeRight = (event) => {
      const {startPosition} = this;
      const {video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const newRight = startPosition.orig.right - clientX + startPosition.x;
      if (video.width - startPosition.orig.left - 10 <= newRight)
        return;
      this.setState({
        right: Math.max(newRight, 0)
      });
    };
    this.resizeBottom = (event) => {
      const {startPosition} = this;
      const {video} = this.state;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      const newBottom = startPosition.orig.bottom - clientY + startPosition.y;
      if (video.height - startPosition.orig.top - 10 <= newBottom)
        return;
      this.setState({
        bottom: Math.max(newBottom, 0)
      });
    };
    this.resizeLeft = (event) => {
      const {startPosition} = this;
      const {video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const newLeft = startPosition.orig.left + clientX - startPosition.x;
      if (video.width - startPosition.orig.right - 10 <= newLeft)
        return;
      this.setState({
        left: Math.max(newLeft, 0)
      });
    };
    this.resizeTopLeft = (event) => {
      const {startPosition} = this;
      const {video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      this.setState({
        top: Math.min(video.height - startPosition.orig.bottom - 10, Math.max(startPosition.orig.top + clientY - startPosition.y, 0)),
        left: Math.min(video.width - startPosition.orig.right - 10, Math.max(startPosition.orig.left + clientX - startPosition.x, 0))
      });
    };
    this.resizeTopRight = (event) => {
      const {startPosition} = this;
      const {video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      this.setState({
        top: Math.min(video.height - startPosition.orig.bottom - 10, Math.max(startPosition.orig.top + clientY - startPosition.y, 0)),
        right: Math.min(video.width - startPosition.orig.left - 10, Math.max(startPosition.orig.right - clientX + startPosition.x, 0))
      });
    };
    this.resizeBottomLeft = (event) => {
      const {startPosition} = this;
      const {video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      this.setState({
        bottom: Math.min(video.height - startPosition.orig.top - 10, Math.max(startPosition.orig.bottom - clientY + startPosition.y, 0)),
        left: Math.min(video.width - startPosition.orig.right - 10, Math.max(startPosition.orig.left + clientX - startPosition.x, 0))
      });
    };
    this.resizeBottomRight = (event) => {
      const {startPosition} = this;
      const {video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      this.setState({
        bottom: Math.min(video.height - startPosition.orig.top - 10, Math.max(startPosition.orig.bottom - clientY + startPosition.y, 0)),
        right: Math.min(video.width - startPosition.orig.left - 10, Math.max(startPosition.orig.right - clientX + startPosition.x, 0))
      });
    };
    this.moveBox = (event) => {
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      const {startPosition} = this;
      const xDiff = startPosition.x - clientX;
      const yDiff = startPosition.y - clientY;
      const xMax = startPosition.orig.right + startPosition.orig.left;
      const yMax = startPosition.orig.top + startPosition.orig.bottom;
      this.setState({
        top: Math.min(yMax, Math.max(startPosition.orig.top - yDiff, 0)),
        left: Math.min(xMax, Math.max(startPosition.orig.left - xDiff, 0)),
        bottom: Math.min(yMax, Math.max(startPosition.orig.bottom + yDiff, 0)),
        right: Math.min(xMax, Math.max(startPosition.orig.right + xDiff, 0))
      });
    };
    this.handleMove = (event) => {
      const {top, right, bottom, left} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      const startPosition = {
        x: clientX,
        y: clientY,
        orig: {
          top,
          right,
          bottom,
          left
        }
      };
      this.startPosition = startPosition;
      if (event.nativeEvent instanceof TouchEvent) {
        document.addEventListener("touchmove", this.moveBox, {
          passive: true
        });
        document.addEventListener("touchend", () => {
          document.removeEventListener("touchmove", this.moveBox);
          this.updateOption();
        }, {once: true});
      } else if (event.nativeEvent instanceof MouseEvent) {
        document.addEventListener("mousemove", this.moveBox, {
          passive: true
        });
        document.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", this.moveBox);
          this.updateOption();
        }, {once: true});
      }
    };
    this.state = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      video: {
        width: this.props.video.offsetWidth,
        height: this.props.video.offsetHeight
      }
    };
    this.startPosition = {
      x: 0,
      y: 0,
      orig: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    };
    window.videoResizer = this;
  }
  updateVideoSize() {
    setTimeout(() => {
      this.setState({
        video: {
          width: this.props.video.offsetWidth,
          height: this.props.video.offsetHeight
        }
      });
    }, 100);
  }
  handleMouseDown(event, positionX, positiony) {
    const {top, right, bottom, left} = this.state;
    const startPosition = {
      x: event.clientX,
      y: event.clientY,
      orig: {
        top,
        right,
        bottom,
        left
      }
    };
    this.startPosition = startPosition;
    this.setResizingMode("mouse", positionX, positiony);
  }
  handleTouchStart(event, positionX, positionY) {
    const {top, right, bottom, left} = this.state;
    const startPosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
      orig: {
        top,
        right,
        bottom,
        left
      }
    };
    this.startPosition = startPosition;
    this.setResizingMode("touch", positionX, positionY);
  }
  addResizeEvent(type, eventListener) {
    if (type === "touch") {
      document.addEventListener("touchmove", eventListener, {
        passive: true
      });
      document.addEventListener("touchend", () => {
        document.removeEventListener("touchmove", eventListener);
        this.updateOption();
      }, {once: true});
    } else {
      document.addEventListener("mousemove", eventListener, {
        passive: true
      });
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", eventListener);
        this.updateOption();
      }, {once: true});
    }
  }
  setResizingMode(type, positionY, positionX) {
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
  updateOption() {
    const {top, right, bottom, left} = this.state;
    this.props.setSize({top, right, bottom, left});
  }
  render() {
    const {top, right, bottom, left} = this.state;
    return /* @__PURE__ */ React.createElement("div", {
      className: "option__resize",
      style: {
        top: `${top}px`,
        right: `${right}px`,
        bottom: `${bottom}px`,
        left: `${left}px`
      }
    }, /* @__PURE__ */ React.createElement("div", {
      className: "option__resize__move",
      onMouseDown: this.handleMove,
      onTouchStart: this.handleMove
    }), /* @__PURE__ */ React.createElement("div", {
      className: "optin__resize__point option__resize__point--top--left",
      onMouseDown: (event) => {
        this.handleMouseDown(event, "t", "l");
      },
      onTouchStart: (event) => {
        this.handleTouchStart(event, "t", "l");
      }
    }), /* @__PURE__ */ React.createElement("div", {
      className: "optin__resize__point option__resize__point--top--center",
      onMouseDown: (event) => {
        this.handleMouseDown(event, "t", "c");
      },
      onTouchStart: (event) => {
        this.handleTouchStart(event, "t", "c");
      }
    }), /* @__PURE__ */ React.createElement("div", {
      className: "optin__resize__point option__resize__point--top--right",
      onMouseDown: (event) => {
        this.handleMouseDown(event, "t", "r");
      },
      onTouchStart: (event) => {
        this.handleTouchStart(event, "t", "r");
      }
    }), /* @__PURE__ */ React.createElement("div", {
      className: "optin__resize__point option__resize__point--center--left",
      onMouseDown: (event) => {
        this.handleMouseDown(event, "c", "l");
      },
      onTouchStart: (event) => {
        this.handleTouchStart(event, "c", "l");
      }
    }), /* @__PURE__ */ React.createElement("div", {
      className: "optin__resize__point option__resize__point--center--right",
      onMouseDown: (event) => {
        this.handleMouseDown(event, "c", "r");
      },
      onTouchStart: (event) => {
        this.handleTouchStart(event, "c", "r");
      }
    }), /* @__PURE__ */ React.createElement("div", {
      className: "optin__resize__point option__resize__point--bottom--left",
      onMouseDown: (event) => {
        this.handleMouseDown(event, "b", "l");
      },
      onTouchStart: (event) => {
        this.handleTouchStart(event, "b", "l");
      }
    }), /* @__PURE__ */ React.createElement("div", {
      className: "optin__resize__point option__resize__point--bottom--center",
      onMouseDown: (event) => {
        this.handleMouseDown(event, "b", "c");
      },
      onTouchStart: (event) => {
        this.handleTouchStart(event, "b", "c");
      }
    }), /* @__PURE__ */ React.createElement("div", {
      className: "optin__resize__point option__resize__point--bottom--right",
      onMouseDown: (event) => {
        this.handleMouseDown(event, "b", "r");
      },
      onTouchStart: (event) => {
        this.handleTouchStart(event, "b", "r");
      }
    }));
  }
}
