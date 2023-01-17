
/*-----------------------MENU----------------------- */

//Game Rules reveal
const btnGR = document.querySelector('button#gamerule');
const divGR = document.querySelector('div#gamerules');

function openGameRules(){
    divGR.classList.toggle("hiddendiv");
}
btnGR.addEventListener('click',openGameRules);

//Game Informations reveal
const btnGI = document.querySelector('button#begin-game');
const divGI = document.querySelector('div#gameinformations');
function openGameInformations(){
    divGI.classList.toggle('hiddendiv');
}
btnGI.addEventListener('click',openGameInformations);

//Régi játékok eredményeinek betöltése
const selPGR = document.querySelector('select#selectprevgame');
let dataPGR; //PGR = Previous Games' Results

function loadFromJson(func){            // json betöltése
    let rf = new XMLHttpRequest();
    rf.overrideMimeType("application/json");
    rf.open('GET','previous_games_results.json', true);
    rf.onreadystatechange = function () {
        if (rf.readyState === 4 && rf.status === 200){
            func(rf.responseText);
        }
    };
    rf.send(null);
}

function generateSelectOptions(dataPGR){//legenerályjuk a váalsztási lehetőségeket
    //console.log(dataPGR);
    for (let i = 0; i < dataPGR.length;i++){
        let newOption = document.createElement('option');
        newOption.setAttribute('value',i);
        newOption.innerText = `${dataPGR[i]['player1']}-${dataPGR[i]['player2']}; ${dataPGR[i]['player1wins']}-${dataPGR[i]['player2wins']}`;
        //console.log(newOption);
        selPGR.appendChild(newOption);
    }
}

function loadPGRFromLocalStorage(){
    let tmp = JSON.parse(localStorage.getItem('dataPGR'));
    if (tmp === null){                      // ha nem tudtuk betölteni local storage-ből, akkor valszleg még nincs mentett adat
        loadFromJson(function (response){   //ezért olvassuk be fileból
            dataPGR = JSON.parse(response); //beletesszük a dataPGR-be
            saveDataPGR(dataPGR);          // mentsük el
        });
    }
    dataPGR = tmp;                         // itt pedig azért, mert ha nem lenne null a local storage kérése
    //console.log(dataPGR);
    generateSelectOptions(dataPGR);        // generáljuk le a választási lehetőségeket
}
loadPGRFromLocalStorage();
const spanPlyr1Wins = document.querySelector('span#player1-wins');
const spanPlyr2Wins = document.querySelector('span#player2-wins');
const btnPGR = document.querySelector('button#loadSelectedGame');
function setPGRData(){          //beírjuk az adatokat a html kódba
    let dataIndex = selPGR.options[selPGR.selectedIndex].value;
    if (dataIndex > -1){
        let selectedData = dataPGR[dataIndex];
        inpPlyOneN.value = selectedData['player1'];
        inpPlyTwoN.value = selectedData['player2'];
        spanPlyr1Wins.innerText = `Győzelmei: ${selectedData['player1wins']}`;
        spanPlyr2Wins.innerText = `Győzelmei: ${selectedData['player2wins']}`;
    }
    else{
        dataIndex = dataPGR.findIndex(e=>e['player1'] === game['plyr1Infs'][0] && e['player2'] === game['plyr2Infs'][0]);
        if (dataIndex > -1){
            let selectedData = dataPGR[dataIndex];
            inpPlyOneN.value = selectedData['player1'];
            inpPlyTwoN.value = selectedData['player2'];
            spanPlyr1Wins.innerText = `Győzelmei: ${selectedData['player1wins']}`;
            spanPlyr2Wins.innerText = `Győzelmei: ${selectedData['player2wins']}`;
        }
    }
}
btnPGR.addEventListener('click',setPGRData);

//Single Player Gamemode
const chbSI = document.querySelector('input#isSingle');
const inpPlyTwoN = document.querySelector('input#playertwoname');   //inputmező

function singlePlayer(){
    inpPlyTwoN.toggleAttribute('disabled');
}
chbSI.addEventListener('click',singlePlayer);

//Start Game
const btnStart = document.querySelector('button#start');
const btnGroup = document.querySelector('div#buttongroup');
const divGame = document.querySelector('div#game');                 //játéktér
const inpPlyOneN = document.querySelector('input#playeronename');   //inputmező
const selectGame = document.querySelector('select#selectgame');
const plyr1n = document.querySelector('h2#player1-name');           //játéktéri név
const plyr2n = document.querySelector('h2#player2-name');           //játéktéri név
const plyr1Figures = document.querySelectorAll('aside#player1>figure');
const plyr2Figures = document.querySelectorAll('aside#player2>figure');
const tableBoard = document.querySelector('table#board');
const shapes = ['trian','cross','circl','squar'];
let game = {
    "isSinglePlayer":false,
    "plyr1Infs": [],
    "plyr2Infs":[],
    "board":[],
    'onTurn':1,
    'end':false,
    'fullness':0
};

function startGame(){//game inicializása
    //console.log(chbSI.checked);
    if (chbSI.checked){//egy játékos-e
        inpPlyTwoN.value = 'PC';
        game['isSinglePlayer'] = true;
    }
    if (selectGame.value === 'new'){
        console.log('Alapbeállítás elkezdődik');
        //game['plyr1Infs'].push(inpPlyOneN.value);
        //game['plyr2Infs'].push(inpPlyTwoN.value);
        fillPlayersShapes();
        console.log(game['plyr1Infs'][0]+", "+game['plyr2Infs'][0]);
        fillBoard();
        game['onTurn'] = 1;
        game['end'] = false;
        game['fullness'] = 0;
        console.log('Alapbeállítás vége');
    }
    else{
        //majd később
    }
    btnGroup.classList.add("hiddendiv");
    divGame.classList.remove("hiddendiv");
    generatePlayGround();
}
btnStart.addEventListener('click',startGame);

function fillBoard(){//nullal feltöltjük a mátrixot
    let newBoard = [];
    for (let i = 0; i < 4; i++){
        let newLine = [];
        for (let j = 0; j < 4;j++){
            newLine.push(null);
        }
        newBoard.push(newLine);
    }
    game['board'] = newBoard;
    console.log('mátrix feltöltve');
}

function fillPlayersShapes(){
    let newplayer1forms = [];
    newplayer1forms.push(inpPlyOneN.value);
    let newplayer2forms = [];
    newplayer2forms.push(inpPlyTwoN.value);
    for (let s of shapes){
        newplayer1forms.push({
            'name':`${s}_red`,
            'amount':2
        });
        newplayer2forms.push({
            'name':`${s}_green`,
            'amount':2
        });
    }
    game['plyr1Infs'] = newplayer1forms;
    game['plyr2Infs'] = newplayer2forms;
    console.log('játékosok feltöltve');
}

function generatePlayGround(){
    //játékos nevek inicializálása a képernyőn
    plyr1n.innerText = game['plyr1Infs'][0];
    plyr2n.innerText = game['plyr2Infs'][0];
    console.log('játékosok neve beállítva');

    //játékosok formáinak mennyiségének inicializálása a képernyőn
    for (let i = 0;i < 4; i++){
        if (game['plyr1Infs'][i+1]['amount'] === 0){
            plyr1Figures[i].setAttribute('hidden','hidden');    //ha nincs már, akkor kitakarjuk
        }
        else{
            plyr1Figures[i].removeAttribute('hidden');
            plyr1Figures[i].children[1].innerText = `${game['plyr1Infs'][i+1]['amount']}x`; // ha van még akkor frissítjük
        }
        if (game['plyr2Infs'][i+1]['amount'] === 0){
            plyr2Figures[i].setAttribute('hidden','hidden');
        }
        else{
            plyr2Figures[i].removeAttribute('hidden');
            plyr2Figures[i].children[1].innerText = `${game['plyr2Infs'][i+1]['amount']}x`;
        }
    }
    console.log('mennyiségek beállítva')

    //tábla felépítése
    let table = document.createElement('table');
    for (let r of game['board'])
    {
        let tr = document.createElement('tr');
        for (let c of r)
        {
            let td = document.createElement('td');
            if (c != null)
            {
                let newImg = document.createElement('img');              
                newImg.setAttribute('src',`kepek\\formak\\${c}.png`);
                newImg.setAttribute('alt',c)
                td.appendChild(newImg);
            }
            else {
                td.classList.add('freeplace');
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    tableBoard.innerHTML = table.innerHTML;
    console.log('táblázat kész');
    if (game['onTurn'] === 1){
        document.querySelector('body').style.backgroundColor = 'darkred';
        plyrPieces[0].style.borderColor = 'gold'; //plyrPieces a game mechanics-on belül van
        plyrPieces[1].style.borderColor = 'black';
        console.log('szín beállítva[piros]');
    }
    else{
        document.querySelector('body').style.backgroundColor  = 'green';
        plyrPieces[0].style.borderColor = 'black';
        plyrPieces[1].style.borderColor = 'gold';
        console.log('szín beállítva[zold]');
    }
}

/*------------------------------The Game Mechanics----------------------------------*/

//bábú kijelölése, hogy pályára helyezzük
let selected = null;
const plyrPieces = document.querySelectorAll('div#game>aside'); //a formák, amiket a játékosok a táblára rakhatnak

function currentPlayer(){
    return game['onTurn'];
}

function previousPlayer(){
    return game['onTurn'] === 1 ? 2 : 1;
}

function removeSelection(func){
    for (let e of plyrPieces[func()-1].children)
    {
        if (e.matches('figure')){
            //console.log(e.children[0]);
            e.children[0].classList.remove('selectedpiece');
        }
    }
    selected = null;
}

function selectToPutOnBoard(ev){
    let target = ev.target;
    let parent = target.parentElement;

    if(target.matches('img')){
        while (!parent.matches('aside')){
            parent = parent.parentElement;
        }

        if (parent.matches('aside') &&
            parent.getAttribute('id') === `player${game['onTurn']}`)
        {
            removeSelection(currentPlayer);
            target.classList.add('selectedpiece');
            selected = target.getAttribute('alt');
        }
    }
    console.log(selected);
}
plyrPieces[0].addEventListener('click',selectToPutOnBoard);
plyrPieces[1].addEventListener('click',selectToPutOnBoard);

//bábú pályára helyezése
// tableBoard pálya referenciája meg van
//kattintott cella koordinátáinak megszerzése
function getCoords(ev){
    let coords = {'X':-1,'Y':-1};           //default érték, ha nem a táblán lévő mezőkre kattintanánk
    let target = ev.target;
    if (target.matches('td')){
        coords['X'] = target.cellIndex;
        coords['Y'] = target.parentElement.rowIndex;
    }
    return coords;
}

//játékos bábúi számának csökkentése
function decreasePieceAmount(s){
    for (let i = 1; i < 5;i++){
        if (game[`plyr${game['onTurn']}Infs`][i]['name'] === s &&
            game[`plyr${game['onTurn']}Infs`][i]['amount'] > 0)
        {
            game[`plyr${game['onTurn']}Infs`][i]['amount']--;
        }
    }

}

//bábú lerakása
function placePiece(ev){
    let coords = getCoords(ev);
    if (!game['end'] &&                                     //nincs vége a játknak
        selected != null &&                                //ha van kiválasztva bábú
        coords['X'] != -1 &&                               //ha a táblán belüli mezőre kattintunk
        game['board'][coords['Y']][coords['X']] === null) //ha az adott helyen még nincs bábú
    { 
        game['board'][coords['Y']][coords['X']] = selected;
        decreasePieceAmount(selected);
        game['fullness']++;                                 //táblázat telítettségének növelése
        endOfGame();
        if ((!game['end']) && game['onTurn'] === 1){
            game['onTurn'] = 2;
        }
        else if(!game['end'] && game['onTurn'] === 2){
            game['onTurn'] = 1;
        }
        generatePlayGround();
    }
    removeSelection(previousPlayer);
    //console.log(coords);
}
tableBoard.addEventListener('click',placePiece);

//játék végét ellenőrző rész

function verticalMatches(){
    let end = false;
    let i = 0;
    while ( i < 4 && !end){
        let col = [game['board'][0][i],game['board'][1][i],game['board'][2][i],game['board'][3][i]];
        if (col.every(e=>e!=null))
        {
            end = col[0].substring(0,6) != col[1].substring(0,6) && col[0].substring(0,6) != col[2].substring(0,6) && col[0].substring(0,6) != col[3].substring(0,6) &&
                  col[1].substring(0,6) != col[2].substring(0,6) && col[1].substring(0,6) != col[3].substring(0,6) && 
                  col[2].substring(0,6) != col[3].substring(0,6);
            {//end = col.every((e,j,arr)=>arr.every((f,k)=> j!=k ? e!=f :false ));
            /*for (let j = 0; j < 4; j++){
                for (let k = 0; k < 4; k++){
                    if (j != k){
                        end = end && col[j] != col[k];
                    }
                }
            }*/
            }
        }
        i++;
    }
    return end;
}

function horizontalMatches(){
    let end = false;
    let i = 0;
    while (i < 4 && !end){
        let row = game['board'][i];
        if (game['board'][i].every(e=>e!=null)){
            end = row[0].substring(0,6) != row[1].substring(0,6) && row[0].substring(0,6) != row[2].substring(0,6) && row[0].substring(0,6) != row[3].substring(0,6) &&
                  row[1].substring(0,6) != row[2].substring(0,6) && row[1].substring(0,6) != row[3].substring(0,6) &&
                  row[2].substring(0,6) != row[3].substring(0,6);
        }
        i++;
    }
    return end;
}

function squareMatches(){
    let end = false;
    for (let i = 0; i < 4 && !end; i+= 2){              // egész tábla
        for (let j = 0;j < 4  && !end;j+=2){
            {/*let noNulls = true;
            let littleSquare = [];
            end = true;
            for ( let k = i; k < i + 2 && noNulls;k++){         //2x2-es területet járja be
                for (let l = j; l < j+2 && noNulls; l++ ){     //megvizsgálja, van-e a null a kis négyzetben
                    noNulls = noNulls && (game['board'][k][l] != null);
                    littleSquare.push(game['board'][k][l]);
                    console.log(game['board'][k][l]);
                }
            }
            if (noNulls){
                for (let k = 0; k < 4 && end; k++){            // nincs újra bejárjuk
                    for (let l = 0; l < 4 && end;l++){       //és vizsgáljuk, hogy minden elem különbözik-e
                        if (k != l){
                            end = end && littleSquare[k].substring(0,6) != littleSquare[l].substring(0,6);
                        }
                    }
                }
            }
            else{
                end = false;
            }*/} // ez csak próbálkozás volt, hogy ne így kelljen megoldanom, ahogy tettem
            let littleSquare = [];
            for ( let k = i; k < i+2;k++){
                for (let l = j; l < j+2;l++){
                    littleSquare.push(game['board'][k][l]);                    
                }   
            }
            if (littleSquare.every(e=>e!=null)){
                end = littleSquare[0].substring(0,6) != littleSquare[1].substring(0,6) && 
                      littleSquare[0].substring(0,6) != littleSquare[2].substring(0,6) && 
                      littleSquare[0].substring(0,6) != littleSquare[3].substring(0,6) && 
                      littleSquare[1].substring(0,6) != littleSquare[2].substring(0,6) &&
                      littleSquare[1].substring(0,6) != littleSquare[3].substring(0,6) &&  
                      littleSquare[2].substring(0,6) != littleSquare[3].substring(0,6);
            }
        }
    }
    return end;
}

function backToTheHomePage(){
    document.querySelector('body').style.backgroundColor = 'white';
    divGame.classList.add('hiddendiv');
    btnGroup.classList.remove('hiddendiv');
    document.querySelector('div#end-game-window').remove();
}

function advertiseWinner(winner){
    //párbeszédpanel
    let window = document.createElement('div');
    window.setAttribute('id','end-game-window');
    let h1 = document.createElement('h1');
    h1.innerText = 'Játék vége';
    window.appendChild(h1);
    //végeredmény elkészítése
    let h2 = document.createElement('h2');
    if (winner === 'döntetlen'){
        h2.innerText = winner;
    }
    else {
        h2.innerText = `Győztes: ${winner}`;
    }
    window.appendChild(h2);
    //állás kiírása
    let h4names = document.createElement('h4');
    let h4res = document.createElement('h4');
    let ind = dataPGR.findIndex(e=>e['player1'] === game['plyr1Infs'][0] && e['player2'] === game['plyr2Infs'][0]);
    h4names.innerText = `${dataPGR[ind]['player1']} - ${dataPGR[ind]['player2']}`;
    h4res.innerText = `${dataPGR[ind]['player1wins']} - ${dataPGR[ind]['player2wins']}`;
    window.appendChild(h4names);
    window.appendChild(h4res);
    // vége gomb
    let endbutton = document.createElement('button');
    endbutton.setAttribute('type','button');
    endbutton.setAttribute('id','endbutton');
    endbutton.innerText = 'Vége';
    endbutton.addEventListener('click',backToTheHomePage);
    window.appendChild(endbutton);
    divGame.appendChild(window);
}
{
/*function writeIntoJson(){
    let stringed = JSON.stringify(dataPGR,null,);
    /*let fs;
    window.requestFileSystem(Window.PERSISTENT,100000,function (succ){fs = succ});
    fs.writeFile('previous_games_results.json',stringed,(err)=>{
        if (err){
            throw err;
        }
        console.log('JSON adat mentve');
    });
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('POST','previous_games_results.json',true);
    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4 && xhr.status === 200){
            xhr.setRequestHeader("application/json;charset=UTF-8", "application/x-www-form-urlencoded");
            xhr.send("jsonTxt="+stringed);
        }
    };
    xhr.send();
}*/
}
function saveDataPGR(){
    localStorage.setItem('dataPGR',JSON.stringify(dataPGR));
}
function setGameResult(){
    let foundPlayer = false;
    let i = 0;

    while (dataPGR.length > i && !foundPlayer){ // megnézük van-e a listában az adott játékos pár
        foundPlayer = dataPGR[i]['player1'] === game['plyr1Infs'][0] && dataPGR[i]['player2'] === game['plyr2Infs'][0];
        i++;
    }
    if (foundPlayer){                           //ha van, akkor növeljüka győztes pontszámát
        dataPGR[i-1][`player${game['onTurn']}wins`]++;
    }
    else{                                       //ha nincs hozzá fűzzük a listához
        dataPGR.push({
            'player1': game['plyr1Infs'][0],
            'player2': game['plyr2Infs'][0],
            'player1wins': game['onTurn'] === 1 ? 1 : 0,   // ugye a győztes az éppen soronlevő játékos
            'player2wins': game['onTurn'] === 2 ? 1 : 0
        });
    }
    setPGRData();
    saveDataPGR();
}

function endOfGame(){
    if (verticalMatches() || horizontalMatches() || squareMatches()){
        game['end'] = true;
        console.log('Játék vége!');
        let winner = game[`plyr${game['onTurn']}Infs`][0]; //győztes játékos neve
        //generateSelectOptions();
        setGameResult();
        advertiseWinner(winner);
    }
    else if(game['fullness'] >= 16){
        winner = 'Döntetlen';
        advertiseWinner(winner);
        advertiseWinner(winner);
    }
}

