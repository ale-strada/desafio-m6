import { Router } from "@vaadin/router";
import { state } from "../../state";
let imagen = require("url:../../img/fondo.png");
let piedra = require("url:../../img/piedra.png");
let papel = require("url:../../img/papel.png");
let tijera = require("url:../../img/tijera.png");
let like = require("url:../../img/ICONO-LIKE.png");
class ScorePage extends HTMLElement {
  miJugada: number;
  suJugada: number;

  connectedCallback() {
    let jugadas = ["piedra", "papel", "tijera", ""];
    const cs = state.getState();

    if (cs.visitor) {
      this.miJugada = jugadas.findIndex(
        (j) => j === cs.currentGame.jugadaVisitor.choice
      );
      this.suJugada = jugadas.findIndex(
        (j) => j === cs.currentGame.jugadaLocal.choice
      );
    } else {
      this.miJugada = jugadas.findIndex(
        (j) => j === cs.currentGame.jugadaLocal.choice
      );
      this.suJugada = jugadas.findIndex(
        (j) => j === cs.currentGame.jugadaVisitor.choice
      );
    }

    this.render();

    const buttonGameRoom = this.querySelector(".button-gameroom");
    const ultimaJugada = this.querySelector(".conteiner-jugada");
    const score = this.querySelector(".conteiner");

    (function mostrarJugada() {
      score.classList.add("none");
      setTimeout(() => {
        ultimaJugada.classList.add("none");
        score.classList.remove("none");
      }, 5000);
    })();
    buttonGameRoom.addEventListener("click", (e) => {
      e.preventDefault();
      const cs = state.getState();
      if (cs.visitor) {
        cs.currentGame.jugadaVisitor.start = false;
        cs.currentGame.jugadaVisitor.choice = "";
        cs.start = false;
      } else {
        cs.currentGame.jugadaLocal.start = false;
        cs.currentGame.jugadaLocal.choice = "";
        cs.start = false;
      }
      state.pushGame(cs.currentGame);
      state.setState(cs);

      Router.go("/instructions");
    });
  }

  render() {
    const cs = state.getState();
    let jugada = [piedra, papel, tijera, like];
    this.innerHTML = `
    <style class="select-style" type="text/css">
    .none{
      display:none;
    }
    .conteiner {
      background-image:url(${imagen});
      background-repeat: round;
      padding-top: 115px;
      padding-bottom: 0px;
      padding-left:auto;
      padding-rigth:auto;
      margin-bottom:0px
      }
    .mano{
      width: 160px;
      height: 310px;
      margin:0 auto;
      }
    .mano-visitante{
      transform: rotate(0.5turn);
      position: relative;
      top: 0px;
      margin:10px auto;
      display: flex;
      justify-content: center;
      }
    .mano-local{
      position: relative;
      bottom: 0px;
      margin:0px auto;
      display: flex;
      justify-content: center;
      padding-top: 50px;
      }
    </style>
   
  <div class="conteiner-jugada">  
    <div class="mano-local">
        <img class="mano" src=${jugada[this.miJugada]}>
    </div>
    <div class="mano-visitante">
        <img class="mano" src=${jugada[this.suJugada]}>
    </div>
  </div>

  <div class="conteiner">
    <div class="button-gameroom">
      <button-comp>volver</button-comp>
    </div>
    <manos-comp></manos-comp>
  </div>
    
   

    </div>
    `;
  }
}

customElements.define("score-page", ScorePage);
