import { state } from "../../state";
import { Router } from "@vaadin/router";
export function initCountdown() {
  class Countdown extends HTMLElement {
    shadow: ShadowRoot;
    computerPlay: number;
    myPlay: number;
    countdown: string;
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.render();
      state.subscribe(() => {
        const currentState = state.getState();
      });
    }

    render() {
      const textoOriginal = this.textContent;
      var style = document.createElement("style");
      style.textContent = `
        
        .countdown-conteiner{
            margin:0px auto;
             width: 200px;
             height: 200px;
             border: solid 20px;
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
             border-radius: 50%;
            background: with;
            margin-top:150px;
            margin-bottom:50px;
            display:flex;
            justify-content: center;
            align-item:center;
        }
        .countdown{
            font-size: 160px; 
            font-family: "Source Serif Pro";
            margin:0;
        }
        .button{
            margin:100px auto;
            display: flex;
            justify-content: center;
            align-item:center;
        }
        `;

      this.shadow.innerHTML = `
            
            
        <div class="countdown-conteiner">
            <p class ="countdown"></p>
        </div>
            
        `;
      const lastState = state.getState();

      let inicio = 4;
      const intervalo = setInterval(() => {
        inicio--;
        this.shadow.querySelector(".countdown").textContent = inicio.toString();

        if (inicio === 0) {
          clearInterval(intervalo);
          Router.go("/score");

          // this.shadow.querySelector(".countdown").remove();
          // this.shadow.querySelector(".countdown-conteiner").remove();
          // const button = document.createElement("div");
          // button.innerHTML = `
          //     <button-comp class= "button">Volver</button-comp>
          //     `;
          // button.addEventListener("click", (e) => {
          //   e.preventDefault();
          //   const cs = state.getState();
          //   if (cs.visitor) {
          //     cs.currentGame.jugadaVisitor.start = false;
          //     cs.start = false;
          //   } else {
          //     cs.currentGame.jugadaLocal.start = false;
          //     cs.start = false;
          //   }
          //   state.pushGame(cs.currentGame);
          //   state.setState(cs);

          //   Router.go("/instructions");
          //   // location.reload()
          // });
          // this.shadow.appendChild(button);
        }
        return inicio;
      }, 1000);

      this.shadow.appendChild(style);
    }
  }

  customElements.define("countdown-comp", Countdown);
}
