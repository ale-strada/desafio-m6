export function initTexto() {
	class TextoComp extends HTMLElement {
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
            font-size: 30px;
            font-weight: normal;
            max-width: 300px;
            margin: 50px auto;
            text-align: center;
            padding: 0px 20px;
            color: #000000
        }
		@media (max-width: 600px) {
			.title {
				font-size: 20px;
				margin: 15px auto;
			}
		}
        .info-del-state{
          font-style: normal;
          font-weight: 900;
          font-size: 48px;
        }
        `;

			var shadow = this.attachShadow({ mode: "open" });
			shadow.appendChild(style);

			var p = document.createElement("p");
			p.classList.add("title");
			p.textContent = textoOriginal;
			p.innerHTML = textoOriginal;
			shadow.appendChild(p);
		}
	}
	customElements.define("texto-comp", TextoComp);
}
