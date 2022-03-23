let imagen = require ("url:../../img/fondo.png")
let piedra = require ("url:../../img/piedra.png")
let papel = require ("url:../../img/papel.png")
let tijera = require ("url:../../img/tijera.png")
const starWin = require ("url:../../img/star-ganaste.png")
const starLose = require ("url:../../img/star-perdiste.png")
const empate = require ("url:../../img/empate.jfif")
import { state } from "../../state"

export function initPagePlay(params){

const lastState = state.getState()
state.loadHistory()

state.subscribe(()=>{
    const newState = state.getState()
    currentGame(newState)
    })

    var style = document.createElement ("style")
    style.textContent = `
    .conteiner {
        background-image:url(${imagen});
        background-repeat: round;
        padding:50px;
        margin-bottom:0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height:800px
        width:100%;
    }
    .mano{
        width: 160px;
        height: 310px;
        margin:0 auto;
    }
    .pc-mano{
        transform: rotate(0.5turn);
        position: relative;
        top: 0px;
        margin:10px auto;
        display: flex;
        justify-content: center;
    }
    .mi-mano{
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
        margin:20px auto;
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
    .button-page{
        margin: 0px auto;
        height: 100px;
        align-items:center;
        position: relative;
    }
    .gano{
        background-image:none;
        background-color: #888949 ;
    }
    .perdio{
        background-image:none;
        background-color: #894949 ;
    }
    .star{
        display:flex;
        justify-content: center;
        align-items:center;
    }
    `

const div = document.createElement("div")
div.classList.add ("conteiner")

const countdown = document.createElement("section")
countdown.innerHTML = `<countdown-comp></countdown-comp>`


const sectionFooter = document.createElement("section")
sectionFooter.innerHTML = `<manos-play></manos-play>`


let jugada = [piedra,papel,tijera];

const juegoPC = document.createElement ("div")
const miJuego = document.createElement ("div")
const miResultado = document.createElement ("div")
const button = document.createElement("div")
const buttonDelete = document.createElement("div")
button.classList.add("button-page")
buttonDelete.classList.add("button-page")

juegoPC.classList.add("pc-mano")
miJuego.classList.add("mi-mano")

function contador(){
    const lastState = state.getState();
    const score = {
        vos:0,
        maquina:0
    }
    for (const partidas of lastState.history) {
        const resultado = state.result(partidas)
        if (resultado === "ganaste"){
            score.vos ++
        } else if (resultado === "perdiste"){
            score.maquina ++
        }
    }
    return score
}

;

function finDelJuego(lastState) {
    
    juegoPC.style.opacity = "0.07"
    juegoPC.style.position = "absolute"

    miJuego.style.opacity = "0.07"
    miJuego.style.position = "absolute"

    let result = state.result(lastState.currentGame)
    let star;
    if (result === "ganaste") {
        star = starWin
        div.style.backgroundImage = "none"
        div.style.backgroundColor = "rgba(136, 137, 73, 0.9)"
    } else if (result === "perdiste"){
        star = starLose
        div.style.backgroundImage = "none"
        div.style.backgroundColor = "rgba(137, 73, 73, 0.9)"
    } else if (result === "empate"){
        star = empate
        div.style.backgroundImage = "none"
        div.style.backgroundColor = "rgba(58, 140, 160, 0.9)"
    }

    miResultado.innerHTML= `
    <div class="star">
    <img class="fin" src=${star}>
    <h2 class="resultado-title">${result}</h2>
    </div>
    <div class="score">
        <h3 class="score-title">Score</h3>
        <p class="score-yo">vos:${contador().vos}</p>
        <p class="score-pc">maquina:${contador().maquina}</p>
    </div>
`

    div.appendChild(miResultado)
    div.appendChild(button)
    div.appendChild(buttonDelete)
}
function currentGame(lastState) {

    countdown.remove()
    juegoPC.innerHTML = `<img class="mano" src=${jugada[lastState.currentGame.computerPlay]}>`
    div.appendChild(juegoPC)
    sectionFooter.remove()
    miJuego.innerHTML =  `<img class="mano" src=${jugada[lastState.currentGame.myPlay]}>`
    div.appendChild(miJuego)

    button.innerHTML = `
    <button-comp class= "button">volver a jugar</button-comp>
`
button.addEventListener("click",(e)=>{
    e.preventDefault()
    params.goTo("/dwf-m5-desafio/play")

    
    })

    buttonDelete.innerHTML = `
    <button-comp class= "button">borrar historial</button-comp>
`
buttonDelete.addEventListener("click",(e)=>{
    e.preventDefault()
    state.deleteHistory()
    })


    setTimeout(()=>{
    finDelJuego(lastState)
    }, 2000);
}


div.appendChild(countdown)
div.appendChild(style)
div.appendChild(sectionFooter)

return div
   }