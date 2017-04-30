

/* definir toutes les cartes sous forme de constantes */
var CARD_BOMB_25 = 0;
var CARD_BOMB_50 = 1;
var CARD_BOMB_50_2TOUR = 2;
var CARD_BOMB_100_2TOUR = 3;
var CARD_BOUCLIER_15 = 4;
var CARD_BOUCLIER_45 = 5;
var CARD_BOUCLIER_GEN_POUDRE = 6;
var CARD_ECHANGE_FORCE = 7;
var CARD_DESENVOUTEMENT = 8;
var CARD_MELANGE = 9;
var CARD_UPGRADE = 11;
var CARD_BOMBARDEMENT = 13;

var CARD_EXTRACTEUR_LVL_1 = 12;

var CARD_CANON_LVL_1 = 10;

/* fin des definitions de cartes */

var NB_MAX_SALON = 6;
var NB_MAX_PDV = 150;
var NB_CARTE_MAIN_MAX = 4;
var NB_POUDRE_PAR_TOUR = 5;
var NB_MAX_TIMER = 15;
var NB_MAX_CARTE_ACTIVE = 5;

var fifoJoueurs = [];
var listSalons = [];

var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require("express");
var retirerCarteMelange = true;


var mysql = require('mysql');

var connection;

function bdd_connect(){
  connection = mysql.createConnection({
    host : '217.182.69.175',
    user : 'Vinspi',
    password : 'vinspi13',
    database : 'DropDaBomb',
  });
}


/* ****** CLOCK DU SERVEUR (POUR UPDATE LES TIMERS DES PARTIES) **** */


var CLOCK = setInterval(update_timer, 1000);

function update_timer(){
    for(var i=0; i<NB_MAX_SALON; i++){
        if(listSalons[i] != "LIBRE"){
            if(listSalons[i].timer <= 1){
                listSalons[i].timer = NB_MAX_TIMER;
                finDeTour(listSalons[i]);
            }
            else{
                listSalons[i].timer--;
            }
            io.sockets.to(listSalons[i].nameRoom).emit("CLOCK_UPDATE", listSalons[i].timer);
        }
    }
}



/* ******************************************************************* */

function initListSalon(){
  for(var i=0;i<NB_MAX_SALON;i++){
    listSalons[i] = "LIBRE";
  }
}

function insereSalon(room){
  for(var i=0;i<NB_MAX_SALON;i++){
    if(listSalons[i] == "LIBRE"){
      listSalons[i] = room;
      /* insertion réussie */
      return i;
    }
  }
  return -1;
}

/* ******************************************************************* */

function etatJoueur(pseudo,deck){
  this.pseudo = pseudo;
  this.bouclier = 0;
  this.poudre = 25;
  this.main = [];
  this.deck = deck;
  this.effetsRetardement = [];
  this.cActives = [];
  this.carteActiveNonRetourne = [];
  /* les point du j1 sont MAX_PDV - j2.pdv */
  this.pdv = NB_MAX_PDV;
}

function etatMatch(pseudo1,pseudo2,deck1,deck2) {
  this.tour = 1;
  this.joueur1 = new etatJoueur(pseudo1,deck1);
  this.joueur2 = new etatJoueur(pseudo2,deck2);
  this.nameRoom = "";
  this.timer = NB_MAX_TIMER;
}
/* Vielle version
function effet(id_carte,duree,image_carte){
  this.id_carte = id_carte;
  this.duree = duree; // mettre a -1 pour un effet permanent
  this.imageCarte = image_carte;
}
*/

function effet(id_carte,duree,image_carte,typeCarte,pdv,level){
  this.id_carte = id_carte;
  this.duree = duree; // mettre a -1 pour un effet permanent
  this.imageCarte = image_carte;
  this.typeCarte = typeCarte;
  this.pdv = pdv;
  this.level = level;
}

function Room(name, pseudo1, pseudo2){
  this.name = name;
  this.pseudo1 = pseudo1;
  this.pseudo2 = pseudo2;
}

function fournirSalons(){

  if (fifoJoueurs.length >= 2){

    initMatch(fifoJoueurs[0].pseudo,fifoJoueurs[1].pseudo);

   }
}

function melangeCarte(cartes){

  function echange(i,j){
    var tmp = cartes[i];
    cartes[i] = cartes[j];
    cartes[j] = tmp;
  }
  var j;
  /* deck de huit carte */

  for (var i = 0; i < 8; i++) {
    j = Math.floor(Math.random()*7);
    echange(i,j);
  }
  return cartes;
}

function tireCarteMain(etatJoueur){

  var carteSommetDeck;

  /* 4 cartes dans la main on tire donc (4-nb_carte_dans_main) parmis le deck */

  /* on calcule cb de carte on tire dans le deck */

  var nb_carte_a_tirer = NB_CARTE_MAIN_MAX - etatJoueur.main.length;


  for(var i=0;i<nb_carte_a_tirer;i++){
    /* on recupère une carte du sommet du deck */
    carteSommetDeck = etatJoueur.deck[0];

    /* on retire cette carte du deck de façon à ce qu'elle ne soit pas tiré deux fois */
    etatJoueur.deck.splice(0,1);

    /* puis on ajoute la carte tiré à la main du joueur */
    etatJoueur.main.push(carteSommetDeck);

  }

}

function initMatch(pseudo1, pseudo2){


  var queryCartesJ1 = "SELECT id_Carte, coutCarte, imageCarte, typeCarte FROM JoueurCarteDeck JOIN Deck USING (id_Deck) JOIN Carte USING (id_Carte) WHERE (Pseudo LIKE "+connection.escape(pseudo1)+" AND estActif = 1);";
  var queryCartesJ2 = "SELECT id_Carte, coutCarte, imageCarte, typeCarte FROM JoueurCarteDeck JOIN Deck USING (id_Deck) JOIN Carte USING (id_Carte) WHERE (Pseudo LIKE "+connection.escape(pseudo2)+" AND estActif = 1);";

  var deck1 = [];
  var deck2 = [];

  bdd_connect();

  connection.query(queryCartesJ1, function(err, rows, fields){
    if (err) throw err;
    for(var i in rows){
      rows[i].level = 1;
      deck1.push(rows[i]);
    }
  });

  connection.query(queryCartesJ2, function(err, rows, fields){
    if (err) throw err;
    for(var i in rows){
      rows[i].level = 1;
      deck2.push(rows[i]);
    }

    connection.end();

    var etatM = new etatMatch(pseudo1, pseudo2, deck1, deck2);

    var index = insereSalon(etatM);
    if(index > -1) var nameRoom = "room"+index;
    console.log("nameRoom = "+nameRoom);
    etatM.nameRoom = nameRoom;

    console.log("match n° "+index);



    fifoJoueurs[0].socket.idRoom = index;
    fifoJoueurs[1].socket.idRoom = index;
    (fifoJoueurs[0].socket).join(nameRoom);
    (fifoJoueurs[1].socket).join(nameRoom);

    etatM.joueur1.deck = melangeCarte(etatM.joueur1.deck);
    etatM.joueur2.deck = melangeCarte(etatM.joueur2.deck);

    tireCarteMain(etatM.joueur1);
    tireCarteMain(etatM.joueur2);



    fifoJoueurs[0].socket.emit('matchStart',{'message' : 'match lancé vous etes dans la salle : '+nameRoom , 'etatJoueur' : etatM.joueur1, 'actifAdversaire' : etatM.joueur2.carteActiveNonRetourne});
    fifoJoueurs[1].socket.emit('matchStart',{'message' : 'match lancé vous etes dans la salle : '+nameRoom , 'etatJoueur' : etatM.joueur2, 'actifAdversaire' : etatM.joueur1.carteActiveNonRetourne});



    etatM.socketJ1 = fifoJoueurs[0].socket;
    etatM.socketJ2 = fifoJoueurs[1].socket;


    console.log(etatM);

    fifoJoueurs.shift();
    fifoJoueurs.shift();

    finDeTour(etatM);

    fournirSalons();
  });

}

var server = http.createServer(function(req,res){

  var url_p = url.parse(req.url,true,true);
  console.log(url_p.pathname);
  if(url_p.pathname == '/cli.html'){
    fs.readFile('./cli.html','utf-8',function(error,content){
      res.writeHead(200,{"Content-type":"text/html"});
      res.end(content);
    });
  }
  if(url_p.pathname == '/js/cli.js'){
    fs.readFile('./js/cli.js','utf-8',function(error,content){
      res.writeHead(200,{"Content-type":"text/html"});
      res.end(content);
    });
  }
  else {

    fs.readFile(url_p.pathname,'utf-8',function(error,content){
      res.writeHead(200,{"Content-type":"text/html"});
      res.end(content);
    });
  }

});

function infligeDegats(joueurEmetteur, joueurCible, degats){

   for(var i = 0; i < joueurCible.carteActiveNonRetourne.length; i++){
     if(joueurCible.carteActiveNonRetourne[i].id_carte == CARD_BOUCLIER_GEN_POUDRE){
        joueurCible.poudre += (degats*0.2);   //Vérifier si ça tombe juste.
        console.log("poudre gagnée = "+(degats*0.2));
     }
   }

  console.log(joueurEmetteur.pseudo+' a infligé '+degats+' à '+joueurCible.pseudo);
  var residu;
  var bouclier = joueurCible.bouclier;

  residu = degats - bouclier;
  bouclier = bouclier - degats;
  if(residu < 0) residu = 0;
  if(bouclier < 0) bouclier = 0;

  joueurCible.pdv -= residu;
  joueurCible.bouclier = bouclier;
  joueurEmetteur.pdv += residu;



}


function attaquerBatiment(joueurCible,carte_cible, degats){
  console.log("fonction attaquer batiment -------------------------");
  var residu = degats;
  while(residu > 0){
    joueurCible.carteActiveNonRetourne[carte_cible].pdv -= residu;
    residu = -(joueurCible.carteActiveNonRetourne[carte_cible].pdv);
    console.log("degat pris par un batiment ! : "+joueurCible.carteActiveNonRetourne[carte_cible].imageCarte+" : "+joueurCible.carteActiveNonRetourne[carte_cible].pdv);
    console.log("residu : "+residu);
    if(joueurCible.carteActiveNonRetourne[carte_cible].pdv <= 0){
        if(joueurCible.carteActiveNonRetourne[carte_cible].level == 1){
          (joueurCible.carteActiveNonRetourne).splice(carte_cible,1);
          return;
        }
        else {

          joueurCible.carteActiveNonRetourne[carte_cible].level--;
          joueurCible.carteActiveNonRetourne[carte_cible].pdv = 50;
          switch (+joueurCible.carteActiveNonRetourne[carte_cible].id_carte) {
            case CARD_CANON_LVL_1:
              joueurCible.carteActiveNonRetourne[carte_cible].imageCarte = "SPELL_CANON_LVL_"+joueurCible.carteActiveNonRetourne[carte_cible].level+".jpg";
              break;
            case CARD_EXTRACTEUR_LVL_1:
              joueurCible.carteActiveNonRetourne[carte_cible].imageCarte = "EXTRACTEUR_LVL_"+joueurCible.carteActiveNonRetourne[carte_cible].level+".jpg";
              break;
          }
        }
    }
  }


}

function ajouteEffet(etatJoueur, effet){
  if(etatJoueur.carteActiveNonRetourne.length < NB_MAX_CARTE_ACTIVE){
    etatJoueur.carteActiveNonRetourne.push(effet);
    console.log('Ajoute effet : '+effet.id_carte+' pour '+effet.duree);
    return true; //insertion réussie;
  }
}

function checkEffets(etatJoueur, etatJoueurAdversaire,etatMatch){
  for(var i=0 ; i<NB_MAX_CARTE_ACTIVE ; i++){
    if(etatJoueur.carteActiveNonRetourne[i] === undefined) return; // fin de la liste.
    if(etatJoueur.carteActiveNonRetourne[i].duree == 0){ // timeout de l'effet.

      console.log(etatJoueur.carteActiveNonRetourne[i].id_carte +' durée -- : '+etatJoueur.carteActiveNonRetourne[i].duree+' -> effet appliqué');
      appliqueEffets(etatJoueur,etatJoueurAdversaire,etatJoueur.carteActiveNonRetourne[i]);
      (etatJoueur.carteActiveNonRetourne).splice(i,1);
      if (etatMatch.joueur1.pseudo == etatJoueur.pseudo) {
        etatMatch.socketJ1.emit('update',{'etatJoueur' : etatJoueur, 'actifAdversaire' : etatJoueurAdversaire.carteActiveNonRetourne, 'carteJoue' : etatJoueur.carteActiveNonRetourne[i], 'bouclierAdversaire' : etatJoueurAdversaire.bouclier});
        etatMatch.socketJ2.emit('update',{'etatJoueur' : etatJoueurAdversaire, 'actifAdversaire' : etatJoueur.carteActiveNonRetourne, 'carteJoue' : etatJoueur.carteActiveNonRetourne[i],  'bouclierAdversaire' : etatJoueur.bouclier});
      }
      else {
        etatMatch.socketJ2.emit('update',{'etatJoueur' : etatJoueur, 'actifAdversaire' : etatJoueurAdversaire.carteActiveNonRetourne, 'carteJoue' : etatJoueur.carteActiveNonRetourne[i], 'bouclierAdversaire' : etatJoueurAdversaire.bouclier});
        etatMatch.socketJ1.emit('update',{'etatJoueur' : etatJoueurAdversaire, 'actifAdversaire' : etatJoueur.carteActiveNonRetourne, 'carteJoue' : etatJoueur.carteActiveNonRetourne[i],  'bouclierAdversaire' : etatJoueur.bouclier});

      }

    }
    else if(etatJoueur.carteActiveNonRetourne[i].duree == -1){  //Carte à durée infini
        if(etatJoueur.carteActiveNonRetourne[i].id_carte == CARD_EXTRACTEUR_LVL_1){
          if(etatJoueur.carteActiveNonRetourne[i].level == 1){
            etatJoueur.poudre += 3;
          }
          else if(etatJoueur.carteActiveNonRetourne[i].level == 2){
            etatJoueur.poudre += 8;
          }
          else if(etatJoueur.carteActiveNonRetourne[i].level == 3){
            etatJoueur.poudre += 14;
          }

        }
        else if(etatJoueur.carteActiveNonRetourne[i].id_carte == CARD_CANON_LVL_1){
          if(etatJoueur.carteActiveNonRetourne[i].level == 1){
            infligeDegats(etatJoueur,etatJoueurAdversaire,10);
          }
          else if(etatJoueur.carteActiveNonRetourne[i].level == 2){
            infligeDegats(etatJoueur,etatJoueurAdversaire,25);
          }
          else if(etatJoueur.carteActiveNonRetourne[i].level == 3){
            infligeDegats(etatJoueur,etatJoueurAdversaire,60);
          }
        }
    }

    else{
      etatJoueur.carteActiveNonRetourne[i].duree--; // sinon on décrémente la duree.
      console.log(etatJoueur.carteActiveNonRetourne[i].id_carte +' durée -- : '+etatJoueur.carteActiveNonRetourne[i].duree);

    }
  }
}

function appliqueEffets(etatJoueurEmetteur,etatJoueurAdversaire,effet){
  switch (+effet.id_carte) {

    case CARD_BOMB_50_2TOUR:
      infligeDegats(etatJoueurEmetteur,etatJoueurAdversaire,50);
  //    etatJoueurEmetteur.pdv += 50;
  //    etatJoueurAdversaire.pdv -+ 50;
      break;

    case CARD_BOMB_100_2TOUR:
      infligeDegats(etatJoueurEmetteur,etatJoueurAdversaire,100);
//      etatJoueurEmetteur.pdv += 100;
//      etatJoueurAdversaire.pdv -+ 100;
      break;

    default:

  }
}

function upgrade_batiment(etatJoueur,id){
   console.log("upgrade batiment "+id);
    if(etatJoueur.carteActiveNonRetourne[id].typeCarte == "batiment"){
      switch(+etatJoueur.carteActiveNonRetourne[id].id_carte){

          case CARD_CANON_LVL_1 :
            console.log("upgrade de canon -----------------");
            if(etatJoueur.carteActiveNonRetourne[id].level == 1){
              etatJoueur.carteActiveNonRetourne[id].imageCarte = "SPELL_CANON_LVL_2.jpg";
              etatJoueur.carteActiveNonRetourne[id].level = 2;
              etatJoueur.carteActiveNonRetourne[id].pdv = 50;
              return true;
            }
            else if(etatJoueur.carteActiveNonRetourne[id].level == 2){
              etatJoueur.carteActiveNonRetourne[id].imageCarte = "SPELL_CANON_LVL_3.jpg";
              etatJoueur.carteActiveNonRetourne[id].level = 3;
              etatJoueur.carteActiveNonRetourne[id].pdv = 50;
              return true;
            }
            else{ //Batiment déjà level 3.
              return false;
            }
            break;

          case CARD_EXTRACTEUR_LVL_1 :
            if(etatJoueur.carteActiveNonRetourne[id].level == 1){
              etatJoueur.carteActiveNonRetourne[id].imageCarte = "EXTRACTEUR_LVL_2.jpg";
              etatJoueur.carteActiveNonRetourne[id].level = 2;
              etatJoueur.carteActiveNonRetourne[id].pdv = 50;
              return true;
            }
            else if(etatJoueur.carteActiveNonRetourne[id].level == 2){
              etatJoueur.carteActiveNonRetourne[id].imageCarte = "EXTRACTEUR_LVL_3.jpg";
              etatJoueur.carteActiveNonRetourne[id].level = 3;
              etatJoueur.carteActiveNonRetourne[id].pdv = 50;
              return true;
            }
            else{ //Batiment déjà level 3.
              return false;
            }
            break;
      }
    }
    else{ //La carteActive n'est pas un batiment.
      return false;
    }
}

function finDeMatch(etatMatch){

  var num_room = etatMatch.socketJ1.idRoom;

  console.log("fin du match n° "+num_room);


  if(etatMatch.joueur1.pdv <= 0){

    io.sockets.to(etatMatch.nameRoom).emit('FIN_DU_GAME',{'vainqueur': etatMatch.joueur2.pseudo, 'perdant' : 'maurice'});
    listSalons[num_room] = "LIBRE";
    return;
  }
  if(etatMatch.joueur2.pdv <= 0){
    io.sockets.to(etatMatch.nameRoom).emit('FIN_DU_GAME',{'vainqueur': etatMatch.joueur1.pseudo, 'perdant' : 'maurice'});
    listSalons[num_room] = "LIBRE";
    return;
  }

}

function finDeTour(etatMatch){

  /* c'est la fin du tour du joueur 1 */



  if(etatMatch.tour%2 == 0){
    /* on fait gagner de la poudre */
    etatMatch.joueur1.poudre += NB_POUDRE_PAR_TOUR;
    /* on lui fait piocher des cartes */
    tireCarteMain(etatMatch.joueur1);
    checkEffets(etatMatch.joueur1,etatMatch.joueur2,etatMatch);
    etatMatch.socketJ1.emit('FIN_TOUR', {'joueurTour' : etatMatch.joueur2.pseudo, 'etatJoueur' : etatMatch.joueur1, 'actifAdversaire' : etatMatch.joueur2.carteActiveNonRetourne});
    etatMatch.socketJ2.emit('FIN_TOUR', {'joueurTour' : etatMatch.joueur2.pseudo, 'etatJoueur' : etatMatch.joueur2, 'actifAdversaire' : etatMatch.joueur1.carteActiveNonRetourne});
  }
  else {
    /* on fait gagner de la poudre */    /* on fait gagner de la poudre */

    etatMatch.joueur2.poudre += NB_POUDRE_PAR_TOUR;
    /* on lui fait piocher des cartes */
    tireCarteMain(etatMatch.joueur2);
    checkEffets(etatMatch.joueur2,etatMatch.joueur1,etatMatch);
    etatMatch.socketJ1.emit('FIN_TOUR', {'joueurTour' : etatMatch.joueur1.pseudo, 'etatJoueur' : etatMatch.joueur1, 'actifAdversaire' : etatMatch.joueur2.carteActiveNonRetourne});
    etatMatch.socketJ2.emit('FIN_TOUR', {'joueurTour' : etatMatch.joueur1.pseudo, 'etatJoueur' : etatMatch.joueur2, 'actifAdversaire' : etatMatch.joueur1.carteActiveNonRetourne});

  }

  if(etatMatch.joueur1.pdv <= 0 || etatMatch.joueur2.pdv <= 0){
    finDeMatch(etatMatch);
    return;
  }



  etatMatch.tour++;
  console.log("tour : "+etatMatch.tour);

}

function chercherMatch(pseudo, socket){
  fifoJoueurs.push({'socket': socket,'pseudo': pseudo});
  socket.pseudo = pseudo;
  console.log(pseudo+" cherche un match");
  fournirSalons();
}

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket){

  socket.on('chercherMatch',function(pseudo){
      fifoJoueurs.push({socket: socket,pseudo: pseudo});
      socket.pseudo = pseudo;
      console.log(pseudo+" cherche un match");
      fournirSalons();
  });

  socket.on('AUTH_CLI',function(joueur){
    var pseudo = joueur.pseudo;
    var mdp = joueur.mdp;

    console.log("log request : "+pseudo+" : "+mdp);

    bdd_connect();

    query = "SELECT Pseudo FROM CompteJoueur WHERE (Pseudo LIKE "+connection.escape(pseudo)+" AND mdpCompte LIKE "+connection.escape(mdp)+" );";

    connection.query(query, function(err, rows, fields){
      if (err) throw err;
      if(rows.length == 0){
        socket.emit('AUTH_CLI_FAIL',0);
      }
      else {
        socket.emit('AUTH_CLI_OK',0);
        chercherMatch(pseudo,socket);
      }
    });

    connection.end();


  });

  socket.on('PASSE_TOUR', function(pseudo){
    //finDeTour(listSalons[socket.idRoom]);

    var idRoom = socket.idRoom;
    var etatM = listSalons[idRoom];

    var etatJoueurEmetteur = etatM.joueur1.pseudo == pseudo ? etatM.joueur1 : etatM.joueur2;
    var etatJoueurAdversaire = etatM.joueur1.pseudo == pseudo ? etatM.joueur2 : etatM.joueur1;

    function verificationTourJoueur(){
      /* soit tour joueur1 */
      if(pseudo == etatM.joueur1.pseudo){
        if(etatM.tour%2 == 0) return true;
        else return false;
      }
      /* soit tour joueur 2 */
      else {
        if(etatM.tour%2 == 1) return true;
        else return false;
      }
    }

    if(verificationTourJoueur())
      listSalons[socket.idRoom].timer = 1;


  })

  socket.on('useCard', function(action){

    var idRoom = socket.idRoom;
    var etatM = listSalons[idRoom];

    var pseudo = action.pseudo;
    var id_carte = action.id_carte;
    var id_carte_destroyed;
    var carte_cible;

    var etatJoueurEmetteur = etatM.joueur1.pseudo == pseudo ? etatM.joueur1 : etatM.joueur2;
    var etatJoueurAdversaire = etatM.joueur1.pseudo == pseudo ? etatM.joueur2 : etatM.joueur1;

    var carteJoue;
    var retirerCarte = true;
    retirerCarteMelange = true;
    var flagMelange = false;




    /* fonctions de contrôle */

    function poudreSuffisante(id_carte){
      for(var i=0;i<etatJoueurEmetteur.main.length;i++){
        if(etatJoueurEmetteur.main[i].id_Carte == id_carte && etatJoueurEmetteur.main[i].coutCarte <= etatJoueurEmetteur.poudre){
          return true;
        }
      }
      return false;
    }

    function possedeCarteDansMain(id_carte){
      for(var i=0;i<etatJoueurEmetteur.main.length;i++){
        if(etatJoueurEmetteur.main[i].id_Carte == id_carte){
          return true;
        }
      }
      return false;
    }

    function verificationTourJoueur(){
      /* soit tour joueur1 */
      if(pseudo == etatM.joueur1.pseudo){
        if(etatM.tour%2 == 0) return true;
        else return false;
      }
      /* soit tour joueur 2 */
      else {
        if(etatM.tour%2 == 1) return true;
        else return false;
      }
    }

    /**********************************************************************************************************************************/

    console.log("emetteur : "+etatJoueurEmetteur.pseudo);
    console.log("adversaire : "+etatJoueurAdversaire.pseudo);
    console.log("id_carte joué ------------- "+id_carte);
    console.log(possedeCarteDansMain(id_carte));
    console.log(poudreSuffisante(id_carte));
    console.log(verificationTourJoueur());


    /* on verifie si il n'y a pas de tricherie */
    //retirerCarte = possedeCarteDansMain(id_carte) && poudreSuffisante(id_carte) && verificationTourJoueur();
    if(possedeCarteDansMain(id_carte) && poudreSuffisante(id_carte) && verificationTourJoueur()){


      /*for(var i=0;i<etatJoueurEmetteur.main.length;i++){
          if(etatJoueurEmetteur.main[i].id_Carte == id_carte){
            // on retire la carte joué de la main du joueur //
            carteJoue = etatJoueurEmetteur.main[i];
            etatJoueurEmetteur.main.splice(i,1);
          }
      }

      // il tire une nouvelle carte
      // tireCarteMain(etatJoueurEmetteur); remplace par fonction fin de tour

      // puis on rajoute la carte joué dans le fond du deck
      etatJoueurEmetteur.deck.push(carteJoue);
      etatJoueurEmetteur.poudre -= carteJoue.coutCarte;
      */
      /* *********************************** ajouter des effets de carte dans cette section ************************************** */
      var pos_carte_joue = action.pos_carte;
      carteJoue = etatJoueurEmetteur.main[pos_carte_joue];
      console.log(pos_carte_joue);

      // for(var i=0;i<etatJoueurEmetteur.main.length;i++){
      //   if(etatJoueurEmetteur.main[i].id_Carte == id_carte){
      //     carteJoue = etatJoueurEmetteur.main[i];
      //     pos_carte_joue = i;
      //     break;
      //   }
      // }
      console.log("carte utilisé par "+pseudo+" : "+id_carte);

      switch (+id_carte) {
        case CARD_BOMB_25:
          /* carte zero (BOMB 25)*/
          id_carte_cible = action.carte_cible;
          if(id_carte_cible > -1 && id_carte_cible < 5 ){
              if(etatJoueurAdversaire.carteActiveNonRetourne[id_carte_cible].typeCarte == "batiment"){
                attaquerBatiment(etatJoueurAdversaire,id_carte_cible,25);
              }
              else {  //tricherie
                return;
              }
          }
          else if(id_carte_cible == -1){
            infligeDegats(etatJoueurEmetteur,etatJoueurAdversaire,25);
          }
          else {  //tricherie
            return;
          }
          break;

        case CARD_BOMB_50:
          id_carte_cible = action.carte_cible;
          if(id_carte_cible > -1 && id_carte_cible < 5 ){
              if(etatJoueurAdversaire.carteActiveNonRetourne[id_carte_cible].typeCarte == "batiment"){
                attaquerBatiment(etatJoueurAdversaire,id_carte_cible,50);
              }
              else {  //tricherie
                return;
              }
          }
          else if(id_carte_cible == -1){
            infligeDegats(etatJoueurEmetteur,etatJoueurAdversaire,50);
          }
          else {  //tricherie
            return;
          }
          break;

            break;

        case CARD_BOUCLIER_45:

          etatJoueurEmetteur.bouclier += 45;
          break;

        case CARD_BOUCLIER_15:

          etatJoueurEmetteur.bouclier += 15;
          break;

        case CARD_BOMB_50_2TOUR:

          retirerCarte = ajouteEffet(etatJoueurEmetteur,new effet(CARD_BOMB_50_2TOUR,2,carteJoue.imageCarte,"chargement",-1));
          break;
        case CARD_BOMB_100_2TOUR:
          retirerCarte = ajouteEffet(etatJoueurEmetteur,new effet(CARD_BOMB_100_2TOUR,2,carteJoue.imageCarte,"chargement",-1));
          break;

        case CARD_MELANGE:
          flagMelange = true;
          break;

        case CARD_DESENVOUTEMENT:
          id_carte_destroyed = action.id_carte_destroyed;
          if(id_carte_destroyed < 0 || id_carte_destroyed > etatJoueurAdversaire.carteActiveNonRetourne.length){
            return;
          }
          etatJoueurAdversaire.carteActiveNonRetourne.splice(id_carte_destroyed,1);
          break;

        case CARD_BOUCLIER_GEN_POUDRE:
          retirerCarte = ajouteEffet(etatJoueurEmetteur,new effet(CARD_BOUCLIER_GEN_POUDRE,-1,carteJoue.imageCarte,"sort",-1));
          break;

        case CARD_ECHANGE_FORCE:
          retirerCarte = false;
          var id_carte_cible = action.carte_cible;
          var f = false;  //Flag pour vérifier si l'adversaire possède bien la carte dans la main.
          if(!(id_carte_cible >= 0 && id_carte_cible < 4)){
            return;
          }

          /* copie de la carte */

          var tmp = {'id_Carte': etatJoueurEmetteur.main[pos_carte_joue].id_Carte, 'imageCarte': etatJoueurEmetteur.main[pos_carte_joue].imageCarte, 'coutCarte': etatJoueurEmetteur.main[pos_carte_joue].coutCarte};

          etatJoueurEmetteur.main[pos_carte_joue].id_Carte = etatJoueurAdversaire.main[id_carte_cible].id_Carte;
          etatJoueurEmetteur.main[pos_carte_joue].imageCarte = etatJoueurAdversaire.main[id_carte_cible].imageCarte;
          etatJoueurEmetteur.main[pos_carte_joue].coutCarte = etatJoueurAdversaire.main[id_carte_cible].coutCarte;
          etatJoueurEmetteur.main[pos_carte_joue].typeCarte = etatJoueurAdversaire.main[id_carte_cible].typeCarte;
          etatJoueurEmetteur.main[pos_carte_joue].level = etatJoueurAdversaire.main[id_carte_cible].level;


          etatJoueurEmetteur.main[pos_carte_joue].from = tmp;

          // for(var i=0;i<etatJoueurEmetteur.main.length;i++){
          //   if(etatJoueurEmetteur.main[i].id_Carte == id_carte){
          //       etatJoueurEmetteur.main.splice(i,1);
          //   }
          // }

          //etatJoueurEmetteur.main.splice(pos_carte_joue,1);

          //etatJoueurEmetteur.main.push(carte_cible);  //Deck ou main ?
          etatJoueurEmetteur.poudre -= carteJoue.coutCarte;

          break;

        case CARD_EXTRACTEUR_LVL_1 :
          retirerCarte = ajouteEffet(etatJoueurEmetteur,new effet(CARD_EXTRACTEUR_LVL_1,-1,carteJoue.imageCarte,"batiment",50,1));
          break;

        case CARD_CANON_LVL_1 :
          retirerCarte = ajouteEffet(etatJoueurEmetteur,new effet(CARD_CANON_LVL_1,-1,carteJoue.imageCarte,"batiment",50,1));
          break;

        case CARD_UPGRADE :
          var id_carte_cible = action.carte_cible;
          console.log("upgrade carte cible "+id_carte_cible);
          if (id_carte_cible < 0 || id_carte_cible > 4) return;
          retirerCarte = upgrade_batiment(etatJoueurEmetteur,id_carte_cible);
          break;
        case CARD_BOMBARDEMENT :
          var r = 0;
          for(var i = 0; i < 2; i++){
              infligeDegats(etatJoueurEmetteur,etatJoueurAdversaire,10);
          }
          for(var j = 0; j < 3; j++){
              r = Math.random()*10;
              if(r < Math.pow(2,(3-j)))  infligeDegats(etatJoueurEmetteur,etatJoueurAdversaire,10);
              else break;
          }
          break;
      }




      if(retirerCarte){
        // for(var i=0;i<etatJoueurEmetteur.main.length;i++){
        //   if(etatJoueurEmetteur.main[i].id_Carte == id_carte){
        //     // on retire la carte joué de la main du joueur //
        //     //carteJoue = etatJoueurEmetteur.main[i];
        //     etatJoueurEmetteur.main.splice(i,1);
        //   }
        // }
        etatJoueurEmetteur.main.splice(pos_carte_joue,1);
      }
      // il tire une nouvelle carte
      // tireCarteMain(etatJoueurEmetteur); remplace par fonction fin de tour

      // puis on rajoute la carte joué dans le fond du deck
      if(retirerCarte){
        if(carteJoue.from !== undefined){
          etatJoueurEmetteur.deck.push(carteJoue.from);
          console.log("carte avec un from !!! : "+carteJoue.from.imageCarte);
        }
        else etatJoueurEmetteur.deck.push(carteJoue);
        etatJoueurEmetteur.poudre -= carteJoue.coutCarte;
      }

      if(etatM.joueur1.pdv <= 0 || etatM.joueur2.pdv <= 0){
        finDeMatch(etatM);
        return;
      }

      if(flagMelange){
        var x = etatJoueurEmetteur.main.length;
        for(var k = 0; k < x; k++){
          etatJoueurEmetteur.deck.push(etatJoueurEmetteur.main[0]);
          etatJoueurEmetteur.main.splice(0,1);
        }
        etatJoueurEmetteur.deck = melangeCarte(etatJoueurEmetteur.deck);
        tireCarteMain(etatJoueurEmetteur);

      }

      socket.emit('update',{'etatJoueur' : etatJoueurEmetteur, 'actifAdversaire' : etatJoueurAdversaire.carteActiveNonRetourne, 'carteJoue' : carteJoue, 'bouclierAdversaire' : etatJoueurAdversaire.bouclier});
      socket.broadcast.emit('update',{'etatJoueur' : etatJoueurAdversaire, 'actifAdversaire' : etatJoueurEmetteur.carteActiveNonRetourne, 'carteJoue' : carteJoue,  'bouclierAdversaire' : etatJoueurEmetteur.bouclier});

      //etatM.tour++; /* a changer */
      //console.log(etatM);

      /* ************************************************************************************************************************** */

      console.log("deck :");
      for(var i=0;i<etatJoueurEmetteur.deck.length;i++){
        console.log("carte "+i+" : "+etatJoueurEmetteur.deck[i].imageCarte);
      }
      console.log("main :");
      for(var i=0;i<etatJoueurEmetteur.main.length;i++){
        console.log("carte "+i+" : "+etatJoueurEmetteur.main[i].imageCarte);
      }


    }
    else {
      /* tricherie ! */
      console.log("tricherie !");
      console.log("main :");
      for(var i=0;i<etatJoueurEmetteur.main.length;i++){
        console.log("carte "+i+" : "+etatJoueurEmetteur.main[i].imageCarte);
      }
    }

  });


});

initListSalon();
server.listen(3001);
console.log("server pret");
