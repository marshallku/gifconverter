// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".output {\n    display: block;\n    margin: 0;\n}\n\n.output__file {\n    display: block;\n    max-width: 80vw;\n    max-height: calc(80vh - 5rem);\n    margin-bottom: 10px;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}