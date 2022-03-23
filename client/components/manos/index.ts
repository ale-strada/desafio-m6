let piedra = require ("url:../../img/piedra.png")
let papel = require ("url:../../img/papel.png")
let tijera = require ("url:../../img/tijera.png")
export function initManos() {

    class ManosComp extends HTMLElement {
        shadow:ShadowRoot
       
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            this.render()    
        }
        render() {
           
            var style = document.createElement("style");
            style.textContent = `
        
        .manos-conteiner{
            max-width: 300px;
            margin:0px auto;
            display: flex;
            justify-content: space-around;
            height: 100px;
            position: relative;
            bottom: -70px;
        }
        .mano{
            width: 56px;
            height: 128px;
        }
        .jugada{
            position: relative;
            bottom: 50px; 
        }
        `;

     this.shadow.innerHTML =
        `
            
            
        <div class="manos-conteiner">
            <img class="mano piedra" src=${piedra}>
            <img class="mano papel" src=${papel}>
            <img class="mano tijera" src=${tijera}>
        </div>
            
        `;

    this.shadow.appendChild(style);

        }
    }

    customElements.define('manos-comp', ManosComp);
}