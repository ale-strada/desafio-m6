let piedra = require ("url:../../img/piedra.png")
let papel = require ("url:../../img/papel.png")
let tijera = require ("url:../../img/tijera.png")
import { state } from "../../state"
export function initManosPlay() {

    class ManosPlay extends HTMLElement {
        shadow:ShadowRoot;
        myPlay:number;
        computerPlay:number
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            this.computerPlay = Math.floor((Math.random())*3)
            this.render() 
        }
        
        render() {
        const lastState = state.getState()
        var style = document.createElement("style");
        style.textContent = `
        
        .manos-conteiner{
            background: inherit;
            max-width: 300px;
            margin:0px auto;
            display: flex;
            justify-content: space-around;
            height: 400px;
            position: relative;
            bottom: -90px;
        }
        .mano{
            width: 110px;
            height: 240px;
            opacity: 0.5;
        }
        .jugada{
            position: relative;
            bottom: 50px;
            opacity: 1; 
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
    
    
    const juegaPiedra = this.shadow.querySelector(".piedra")
    juegaPiedra.addEventListener("click",()=>{
        juegaPiedra.classList.add("jugada")
        state.currentGame(0,this.computerPlay)
    })
    const juegaPapel = this.shadow.querySelector(".papel")
    juegaPapel.addEventListener("click",()=>{
        juegaPapel.classList.add("jugada") 
        state.currentGame(1,this.computerPlay)
    })
    const juegaTijera = this.shadow.querySelector(".tijera")
    juegaTijera.addEventListener("click",()=>{
        juegaTijera.classList.add("jugada")
          
        state.currentGame(2,this.computerPlay)
    })  
     
    this.shadow.appendChild(style);

        }
    }

    customElements.define('manos-play', ManosPlay);
}