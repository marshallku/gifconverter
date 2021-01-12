// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "html {\n    user-select: none;\n}\n\n#app {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n    min-height: 100%;\n    text-align: center;\n}\n\n.output__control {\n    margin-top: 15px;\n}\n\n.button {\n    display: inline-flex;\n    align-items: center;\n    border: 0;\n    padding: 0;\n    background: 0;\n    color: #000;\n    font-size: 1rem;\n    font-weight: 400;\n    font-family: inherit;\n    text-decoration: none;\n    cursor: pointer;\n}\n\n.button > svg {\n    margin-right: 5px;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}