// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "html,\r\nbody {\r\n    height: 100%;\r\n}\r\n\r\nhtml::before {\r\n    content: \"\";\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100vw;\r\n    height: 100vh;\r\n    background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);\r\n    z-index: -1;\r\n}\r\n\r\nbody {\r\n    margin: 0;\r\n    font-family: \"Anton\", sans-serif;\r\n    -webkit-font-smoothing: antialiased;\r\n    -moz-osx-font-smoothing: grayscale;\r\n    overflow: hidden;\r\n}\r\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';

  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}