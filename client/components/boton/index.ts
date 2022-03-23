export function initButton() {
  class ButtonComp extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const textoOriginal = this.textContent;
      var style = document.createElement("style");
      style.textContent = `
        .button-container{
            max-width: 560px;
            margin: 20px auto;
            padding: 0px 20px;

        }
        .button{
            background-color: #006CFC;
            font-family: "Odibee Sans";
            font-size: 45px;
            color: white;
            width: 100%;
            text-align: center;
            height: 80px;
            border: solid 10px;
            border-color: #001997;
            border-radius: 5px;
}
        }
        `;
      var shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(style);

      var button = document.createElement("button");
      button.classList.add("button");
      button.textContent = textoOriginal;

      var div = document.createElement("div");
      div.classList.add("button-container");
      div.appendChild(button);

      shadow.appendChild(div);
    }
  }
  customElements.define("button-comp", ButtonComp);
}
