import { Router } from "@vaadin/router";
import { state } from "../../state";

let imagen = require("url:../../img/fondo.png");
let piedra = require("url:../../img/piedra.png");
let papel = require("url:../../img/papel.png");
let tijera = require("url:../../img/tijera.png");
let like = require("url:../../img/iconolike.png");
let starWin = require("../../img/star-ganaste.png");
let starLose = require("../../img/star-perdiste.png");
let empate = require("../../img/star-empate.png");

class ScorePage extends HTMLElement {
  miJugada: number;
  suJugada: number;
  yo: string;
  oponente: string;

  connectedCallback() {
    const cs = state.getState();

    let jugadas = ["piedra", "papel", "tijera", ""];

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

      if (cs.roomId === 1210) {
        this.suJugada = Math.floor(Math.random() * 3);
      }
    }

    this.render();
  }

  addListenerts() {
    const cs = state.getState();
    let ultimoJuego = { miJugada: this.miJugada, suJugada: this.suJugada };

    const buttonGameRoom: any = this.querySelector(".button-gameroom");
    const buttonSalir: any = this.querySelector(".button-salir");
    const ultimaJugada: any = this.querySelector(".conteiner-jugada");
    const miResultado: any = this.querySelector(".resultados");
    const conteiner: any = this.querySelector(".conteiner");

    (function mostrarJugada() {
      setTimeout(() => {
        finDelJuego(ultimoJuego);
      }, 2000);
    })();

    buttonSalir.addEventListener("click", (e) => {
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
      Router.go("/");
    });

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

    function pushHistorial(ultimoJuego) {
      const cs = state.getState();
      const juego = {
        local: 0,
        visitante: 0,
      };
      if (cs.visitor) {
        (juego.visitante = ultimoJuego.miJugada),
          (juego.local = ultimoJuego.suJugada);
      } else {
        (juego.visitante = ultimoJuego.suJugada),
          (juego.local = ultimoJuego.miJugada);
      }
      state.data.historial.push(juego);
    }

    function finDelJuego(ultimoJuego) {
      const cs = state.getState();
      let yo;
      let oponente;
      if (cs.visitor) {
        yo = cs.currentGame.jugadaVisitor.gamerName;
        oponente = cs.currentGame.jugadaLocal.gamerName;
      } else {
        yo = cs.currentGame.jugadaLocal.gamerName;
        oponente = cs.currentGame.jugadaVisitor.gamerName;
      }
      ultimaJugada.classList.add("final");
      pushHistorial(ultimoJuego);
      let result = state.result(ultimoJuego);
      let star;
      if (result === "ganaste") {
        star = starWin;
        conteiner.classList.add("gano");
      } else if (result === "perdiste") {
        star = starLose;
        conteiner.classList.add("perdio");
      } else if (result === "empate") {
        star = empate;
        conteiner.classList.add("empato");
      } else if (result === "Oops!!!") {
        star = empate;
        conteiner.classList.add("empato");
      }

      miResultado.innerHTML = `
          <div class="star">
          <img class="fin" src=${star}>
          <h2 class="resultado-title">${result}</h2>
          </div>
          <div class="score">
              <h3 class="score-title">Score</h3>
              <p class="score-yo">${yo}:${contador().Yo}</p>
              <p class="score-pc">${oponente}:${contador().Oponente}</p>
          </div>
      `;
      buttonGameRoom.innerHTML = `
         <button-comp>volver</button-comp>
      `;
      buttonSalir.innerHTML = `
          <button-comp>Salir del jego</button-comp>
      `;
    }

    function contador() {
      const cs = state.getState();
      const score = {
        Yo: 0,
        Oponente: 0,
      };
      for (const partidas of cs.historial) {
        let ultimoJuego = {
          miJugada: 0,
          suJugada: 0,
        };
        if (cs.visitor) {
          (ultimoJuego.miJugada = partidas.visitante),
            (ultimoJuego.suJugada = partidas.local);
        } else {
          (ultimoJuego.suJugada = partidas.visitante),
            (ultimoJuego.miJugada = partidas.local);
        }

        const resultado = state.result(ultimoJuego);
        if (resultado === "ganaste") {
          score.Yo++;
        } else if (resultado === "perdiste") {
          score.Oponente++;
        }
      }
      return score;
    }
  }

  render() {
    const cs = state.getState();
    let jugada = [piedra, papel, tijera, like];
    this.innerHTML = `
    <style class="select-style" type="text/css">
    .none{
      display:none;
    }
    .final{
      position: absolute;
      left: 40%;
      z-index: -1;
    }
    .conteiner {
      background-image:url(${imagen});
      background-repeat: round;
      height: 900px;
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
      .fin{
        width: 250px;
        height: 250px;
        position: relative;
        left: 40px;
        top: 10px;
    }
    .score{
        margin:70px auto;
        border: solid 3px;
        border-radius: 2px;
        width: 260px;
        height: 220px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: white;
    }
    .score-title{
        align-self: center;
        font-family: "Odibee Sans";
        font-size: 55px;
        margin: 10px;
    }
    .resultado-title{
        font-family: "Odibee Sans";
        font-size: 55px;
        color:white;
        position: relative;
        top:10px;
        right: 140px;
    }
    .score-yo{
        font-family: "Odibee Sans";
        font-size: 45px;
        align-self: flex-end;
        margin: 10px;
    }
    .score-pc{
        font-family: "Odibee Sans";
        font-size: 45px;
        align-self: flex-end;
        margin: 10px;
    }
    .gano{
      background-image:none;
      background-color: rgba(136, 137, 73, 0.9) ;
  }
  .perdio{
      background-image:none;
      background-color: rgba(137, 73, 73, 0.9) ;
  }
  .empato{
    background-image:none;
    background-color:rgba(58, 140, 160, 0.9);
  }
  .star{
      display:flex;
      justify-content: center;
      align-items:center;
  }
    </style> 


  <div class="conteiner">
    <div class="conteiner-jugada">  
      <div class="mano-visitante">
        <img class="mano" src=${jugada[this.suJugada]}>
      </div>
      <div class="mano-local">
        <img class="mano" src=${jugada[this.miJugada]}>
      </div>
    </div>
    <div class = "resultados"></div>
    
    <div class="button-gameroom"></div>
    <div class="button-salir"></div>
  </div>
    
   

    </div>
    `;
    this.addListenerts();
  }
}

customElements.define("score-page", ScorePage);
