const url = "https://malomgame20230324103459.azurewebsites.net/api/steps/";
const state = {
    step: null,
    timer: null,
    gamers: null,
    szam: 10,
    lepes: false
}
const xhr = new XMLHttpRequest();

function requestAPI(metodus, cim, fuggveny, uzenet) {
    xhr.onload = function () { fuggveny(); };
    xhr.open(metodus, cim, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(JSON.stringify(uzenet));
}

function GETFeldolgozo() {
    if (xhr.status == 200 || xhr.status == 201) {
        state.step = JSON.parse(xhr.responseText);
        if (state.gamers == null) state.gamers = state.step.gamers;
        console.log(state.step);
        if (state.step.finish) {
            //true
            console.log("Játék indítása");
            clearInterval(state.timer);
            jatekIndul();
        } else {
            console.log("Várakozás a másik játékosra!");
            if (!state.timer)
                state.timer = setInterval(function () {
                    requestAPI("GET", url + state.step.id, GETFeldolgozo);
                }, 3000);
        }
    } else {
        console.log("Hiba a GET kérésben!", xhr.status);
    }
}

function StepFeldolgozo() {
    if (xhr.status == 200 || xhr.status == 201) {
        state.step = JSON.parse(xhr.responseText);
        if ((state.gamers != state.step.gamers)&&  (state.step.sor !=-1)){
            clearInterval(state.timer);
            let p = document.getElementById("palya");
            p.children[state.step.sor].children[state.step.oszlop].innerHTML="O";
            p.children[state.step.sor].children[state.step.oszlop].onclick = null;
            state.lepes = true;
            //Játékvége??
        }
    } else{
        console.log("Hiba a GET kérésben",xhr.status);
    }
}
function jatekIndul() {
    if(state.gamers ==0) state.lepes=true;
    else{
        state.timer = setInterval(function () {
            requestAPI("GET", url + state.step.id, StepFeldolgozo);
        }, 3000);
    }

    for (let i = 0; i < state.szam; i++) {

        let sor = document.createElement("div");
        sor.className = "sor";

        for (let j = 0; j < state.szam; j++) {
            let cella = document.createElement("div");
            cella.className = "cella";
            cella.dataset.sor = i;
            cella.dataset.oszlop = j;
            cella.onclick=katt;
            sor.appendChild(cella);

        }
        document.getElementById("palya").appendChild(sor);
    }

};
function katt(){
    if(state.lepes)
    {
 this.innerHTML='<p>X</p>';
 state.step.sor=this.dataset.sor;
 state.step.oszlop=this.dataset.oszlop;
 state.step.gamers=state.gamers;
 this.onclick=null;
 requestAPI("PUT",url+state.step.id,PUTFeldolgozo, state.step);
 console.log("Az ellenfél lépésre vár .....");
 state.lepes = false;
 //Játék vége
    }
};
function PUTFeldolgozo(){
    if((xhr.status==200)  || (xhr.status==201))
    {
        state.timer = setInterval(function () {
            requestAPI("GET", url + state.step.id, StepFeldolgozo);
        }, 3000);
    }
    else console.log("PUTHiba", xhr.status)
}
console.log("Szkript");
requestAPI("GET", url, GETFeldolgozo);