import React from "../web_modules/react.js";
import "./VideoCropper.css.proxy.js";
export default class VideoCroper extends React.Component {
  constructor(props) {
    super(props);
    this.moveTop = (event) => {
      const {startPosition, video} = this.state;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      const newTop = startPosition.orig.top + clientY - startPosition.y;
      if (video.height - startPosition.orig.bottom - 10 <= newTop)
        return;
      this.setState({
        top: Math.max(newTop, 0)
      });
    };
    this.moveRight = (event) => {
      const {startPosition, video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const newRight = startPosition.orig.right - clientX + startPosition.x;
      if (video.width - startPosition.orig.left - 10 <= newRight)
        return;
      this.setState({
        right: Math.max(newRight, 0)
      });
    };
    this.moveBottom = (event) => {
      const {startPosition, video} = this.state;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      const newBottom = startPosition.orig.bottom - clientY + startPosition.y;
      if (video.height - startPosition.orig.top - 10 <= newBottom)
        return;
      this.setState({
        bottom: Math.max(newBottom, 0)
      });
    };
    this.moveLeft = (event) => {
      const {startPosition, video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const newLeft = startPosition.orig.left + clientX - startPosition.x;
      if (video.width - startPosition.orig.right - 10 <= newLeft)
        return;
      this.setState({
        left: Math.max(newLeft, 0)
      });
    };
    this.moveTopLeft = (event) => {
      const {startPosition, video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      this.setState({
        top: Math.min(video.height - startPosition.orig.bottom - 10, Math.max(startPosition.orig.top + clientY - startPosition.y, 0)),
        left: Math.min(video.width - startPosition.orig.right - 10, Math.max(startPosition.orig.left + clientX - startPosition.x, 0))
      });
    };
    this.moveTopRight = (event) => {
      const {startPosition, video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      this.setState({
        top: Math.min(video.height - startPosition.orig.bottom - 10, Math.max(startPosition.orig.top + clientY - startPosition.y, 0)),
        right: Math.min(video.width - startPosition.orig.left - 10, Math.max(startPosition.orig.right - clientX + startPosition.x, 0))
      });
    };
    this.moveBottomLeft = (event) => {
      const {startPosition, video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      this.setState({
        bottom: Math.min(video.height - startPosition.orig.top - 10, Math.max(startPosition.orig.bottom - clientY + startPosition.y, 0)),
        left: Math.min(video.width - startPosition.orig.right - 10, Math.max(startPosition.orig.left + clientX - startPosition.x, 0))
      });
    };
    this.moveBottomRight = (event) => {
      const {startPosition, video} = this.state;
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      this.setState({
        bottom: Math.min(video.height - startPosition.orig.top - 10, Math.max(startPosition.orig.bottom - clientY + startPosition.y, 0)),
        right: Math.min(video.width - startPosition.orig.left - 10, Math.max(startPosition.orig.right - clientX + startPosition.x, 0))
      });
    };
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
          left: 0
        }
      },
      video: {
        width: this.props.video.offsetWidth,
        height: this.props.video.offsetHeight
      }
    };
    this.updateVideoSize();
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
    this.setState({
      startPosition
    });
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
    this.setState({
      startPosition
    });
    this.setResizingMode("touch", positionX, positionY);
  }
  updateOption() {
    const {top, right, bottom, left} = this.state;
    this.props.setSize({top, right, bottom, left});
  }
  setResizingMode(type, positionY, positionX) {
    if (positionX === "c" || positionY === "c") {
      const resizeFunction = positionY === "c" ? positionX === "l" ? this.moveLeft : this.moveRight : positionY === "t" ? this.moveTop : this.moveBottom;
      if (type === "touch") {
        document.addEventListener("touchmove", resizeFunction, {
          passive: true
        });
        document.addEventListener("touchend", () => {
          document.removeEventListener("touchmove", resizeFunction);
          this.updateOption();
        }, {once: true});
      } else {
        document.addEventListener("mousemove", resizeFunction, {
          passive: true
        });
        document.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", resizeFunction);
          this.updateOption();
        }, {once: true});
      }
    } else {
      const resizeFunction = positionY === "t" ? positionX === "l" ? this.moveTopLeft : this.moveTopRight : positionX === "l" ? this.moveBottomLeft : this.moveBottomRight;
      if (type === "touch") {
        document.addEventListener("touchmove", resizeFunction, {
          passive: true
        });
        document.addEventListener("touchend", () => {
          document.removeEventListener("touchmove", resizeFunction);
          this.updateOption();
        }, {once: true});
      } else {
        document.addEventListener("mousemove", resizeFunction, {
          passive: true
        });
        document.addEventListener("mouseup", () => {
          document.removeEventListener("mousemove", resizeFunction);
          this.updateOption();
        }, {once: true});
      }
    }
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
