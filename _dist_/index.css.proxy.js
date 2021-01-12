// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "* {\n    box-sizing: border-box;\n    -webkit-tap-highlight-color: transparent;\n}\n\nhtml,\nbody {\n    height: 100%;\n}\n\nhtml::before {\n    content: \"\";\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100vw;\n    height: 100vh;\n    background-image: linear-gradient(to top, #ffc7ee 0%, #abc5f1 100%);\n    z-index: -1;\n}\n\nbody {\n    margin: 0;\n    font-family: \"Anton\", sans-serif;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    overflow: hidden;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}