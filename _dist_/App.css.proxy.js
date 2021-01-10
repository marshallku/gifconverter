// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "html {\r\n    user-select: none;\r\n}\r\n\r\n#app {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    flex-direction: column;\r\n    min-height: 100%;\r\n    text-align: center;\r\n}\r\n\r\n.output__control {\r\n    margin-top: 15px;\r\n}\r\n\r\n.button {\r\n    display: inline-flex;\r\n    align-items: center;\r\n    border: 0;\r\n    padding: 0;\r\n    background: 0;\r\n    color: #000;\r\n    font-size: 1rem;\r\n    font-weight: 400;\r\n    font-family: inherit;\r\n    text-decoration: none;\r\n    cursor: pointer;\r\n}\r\n\r\n.button > svg {\r\n    margin-right: 5px;\r\n}\r\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}