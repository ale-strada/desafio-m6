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
        .conteiner{
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 100px auto;
          width: 300px;
          height: 300px;
        }
        @media (max-width: 600px) {
          .conteiner {
            margin: 30px auto;
          }
        }
        .countdown-conteiner{
          margin: 0px auto;
          width: 200px;
          height: 200px;
          border: solid 20px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          padding: 15px;
          border-right-color: #888;
          -webkit-animation: rotate 1s infinite linear;
          position: absolute;
        }
        .countdown{
            font-size: 160px; 
            font-family: "Source Serif Pro";
            margin:0;
            position: absolute;
        }
        @-webkit-keyframes rotate {
          100% {
            -webkit-transform: rotate(360deg);
          }
        
        `;

			this.shadow.innerHTML = `
            
      <div class = "conteiner">
        <div class="countdown-conteiner"></div>
        <p class="countdown"></p>
      </div>
            
        `;
			const lastState = state.getState();
			const countdown = this.shadow.querySelector(".countdown");

			let inicio = 4;
			const intervalo = setInterval(() => {
				inicio--;
				countdown && (countdown.textContent = inicio.toString());

				if (inicio === 0) {
					clearInterval(intervalo);

					Router.go("/score");
				}
				return inicio;
			}, 1000);

			this.shadow.appendChild(style);
		}
	}

	customElements.define("countdown-comp", Countdown);
}
