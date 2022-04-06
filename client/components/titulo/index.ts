export function initTitle() {
  class TitleComp extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render() {
      const textoOriginal = this.innerHTML;
      var style = document.createElement("style");
      style.textContent = `
        .title{
            font-family: "Source Serif Pro";
            font-size: 80px;
            font-weight: normal;
            max-width: 600px;
            margin: 60px auto;
            text-align: center;
            padding: 0px 20px;
            color: #009048
        }
        `;

      var shadow = this.attachShadow({ mode: "open" });
      shadow.appendChild(style);

      var h1 = document.createElement("h1");
      h1.classList.add("title");
      h1.innerHTML = textoOriginal;
      shadow.appendChild(h1);
    }
  }
  customElements.define("titulo-comp", TitleComp);
}
