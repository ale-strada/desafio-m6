export function initTexto() {
    class TextoComp extends HTMLElement {
        constructor() {
            super();
            this.render()
        }
        render() {
            const textoOriginal = this.textContent
            var style = document.createElement("style");
            style.textContent = `
        .title{
            font-family: "Source Serif Pro";
            font-size: 40px;
            font-weight: normal;
            max-width: 300px;
            margin: 20px auto;
            text-align: center;
            padding: 0px 20px;
            color: #000000
        }
        `;
           
            var shadow = this.attachShadow({ mode: 'open' });
            shadow.appendChild(style);

            var p = document.createElement("p");
            p.classList.add("title");
            p.textContent = textoOriginal          
            shadow.appendChild(p);
        }
    }
    customElements.define('texto-comp', TextoComp);
    }