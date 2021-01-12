// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".option:not(.loaded) {\n    opacity: 0;\n    position: absolute;\n}\n\n.option button {\n    border: 0;\n    padding: 0;\n    background: 0;\n    outline: 0;\n    cursor: pointer;\n}\n\n.option button:focus svg * {\n    stroke: #fff;\n}\n\n.option button:focus:not(:focus-visible) svg * {\n    stroke: #000;\n}\n\n.option__preview {\n    position: relative;\n    margin-bottom: 1rem;\n}\n\n.option.loaded > .option__preview > video {\n    display: block;\n    max-width: 80vw;\n    max-height: calc(100vh - 9.2rem - 150px);\n}\n\n.option__input {\n    max-width: 250px;\n    margin: 0 auto 0.8rem auto;\n}\n\n.option__input > .title {\n    text-align: left;\n    font-size: 0.55rem;\n    padding: 0 5px;\n    margin-bottom: 0.15rem;\n    line-height: 0.7rem;\n}\n\n.option__input > div {\n    display: flex;\n}\n\n.option__input > div > input {\n    width: 100%;\n    background: 0;\n    border: 0;\n    outline: 0;\n    font-family: inherit;\n    font-size: 0.8rem;\n    line-height: 1.2rem;\n    padding: 2.5px 5px;\n    border-radius: 5px;\n    background: rgba(255, 255, 255, 0.15);\n    transition: background 0.25s;\n}\n\n.option__input button {\n    padding: 0;\n    margin-left: 10px;\n}\n\n.option__input svg {\n    width: 1rem;\n    height: 1rem;\n}\n\n.option__input > input:focus {\n    background: rgba(255, 255, 255, 0.4);\n}\n\n.option__convert {\n    display: block;\n    margin: 0 auto;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}