// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".output {\r\n    display: block;\r\n    margin: 0;\r\n}\r\n\r\n.output__file {\r\n    display: block;\r\n    max-width: 80vw;\r\n    max-height: calc(80vh - 5rem);\r\n    margin-bottom: 10px;\r\n}\r\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}