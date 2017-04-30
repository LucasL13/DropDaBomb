
// var starter_HP = [0,1,2,3,4,5,6,7];
// var starter_MTBBWY = [0,1,2,3,4,5,6,7];
// var starter_YSNP = [0,1,2,3,4,5,6,7];

// var fifoJoueurs = [];
// var listSalons = [];

// var http = require('http');
// var url = require('url');
var mysql = require('mysql');
// var c = require('./const');


var connection;


function bdd_connect(){
  connection = mysql.createConnection({
    host : '217.182.69.175',
    user : 'Vinspi',
    password : 'vinspi13',
    database : 'DropDaBomb',
  });
}

// connection.connect();

// var server = http.createServer();
// var io = require('socket.io').listen(server);

// server.listen(8080);
// console.log("server pret");

// io.sockets.on("connection", function(socket){
//     console.log("nouvelle connexion");
//     socket.on("CREATE_ACCOUNT_CHECK", function(obj){check_account(obj, socket);});
//     socket.on("CREATE_ACCOUNT_SEND", function(obj){create_account(obj, socket);});
//     socket.on("CONNECT_ACCOUNT_CHECK", function(obj){connect_account(obj, socket)});
// });

// function connect_account(obj, sock){
//     console.log("Demande de connexion : " + JSON.stringify(obj));

//      var req = "SELECT Pseudo, mdpCompte FROM CompteJoueur WHERE (Pseudo LIKE "+connection.escape(obj.pseudo)+" AND " +
//                 "mdpCompte LIKE " +connection.escape(obj.password) +");";

//         connection.query(req, function(err, rows, fields){
//             if (err) throw err;
//             if(rows.length != 0){
//                 console.log("success");
//                 sock.emit("CONNECT_ACCOUNT_CHECK_SUCCESS", 0);
//             }
//             else{
//                 console.log("fail");
//                 sock.emit("CONNECT_ACCOUNT_CHECK_FAIL", 0);
//             }
//         });
// }

// function check_account(obj, sock){
//         console.log(obj.mdp.length + " " + c.MIN_SIZE_PASSWORD);

//         if(obj.mdp.length < c.MIN_SIZE_PASSWORD){
//             return c.ERR_MDP;
//         }

//         var r = c.CREATE_ACCOUNT_FAILED_PSEUDO;

//         var req = "SELECT Pseudo, mailCompte FROM CompteJoueur WHERE (Pseudo LIKE "+connection.escape(obj.pseudo)+" OR " +
//                 "mailCompte LIKE " +connection.escape(obj.email) +");";

//         console.log(req);

//         connection.query(req, function(err, rows, fields){
//             if (err) throw err;
//             if(rows.length != 0){
//                 sock.emit("CREATE_ACCOUNT_CHECK_FAIL_ALREADYEXIST", 0);
//             }
//             else{
//                 sock.emit("CREATE_ACCOUNT_CHECK_SUCCESS", 0);
//             }
//         });
// }

// function create_account(obj, sock){

//             console.log("Jai recu final create : " + JSON.stringify(obj));

//                 connection.query("INSERT INTO CompteJoueur (Pseudo, mailCompte, mdpCompte, nomGuilde, id_Division) " +
//                              "VALUES ("+connection.escape(obj.pseudo)+","+connection.escape(obj.email)+","+connection.escape(obj.mdp)+",NULL, NULL);");
//                 connection.query("INSERT INTO Deck(id_Deck,estActif) VALUES ("+connection.escape(obj.pseudo+'0')+",0);");
//                 connection.query("INSERT INTO Deck(id_Deck,estActif) VALUES ("+connection.escape(obj.pseudo+'1')+",1);");
//                 connection.query("INSERT INTO Deck(id_Deck,estActif) VALUES ("+connection.escape(obj.pseudo+'2')+",0);");


//                 var starter;

//                 if(obj.starter == "HP"){
//                     starter = starter_HP;
//                 }
//                 else if(obj.starter == "MTBBWY"){
//                     starter = starter_MTBBWY;
//                 }
//                 else if(obj.starter == "YSNP"){
//                     starter = starter_YSNP;
//                 }
//                 else{
//                     return;
//                 }

//                 console.log("Je crée starter : " + starter);

//                 for(var i=0; i<8; i++){
//                     connection.query("INSERT INTO JoueurCarteDeck(qteCarteDeck, id_Deck, Pseudo, id_Carte) VALUES (1, "+connection.escape(obj.pseudo+'0')+","+connection.escape(obj.pseudo)+","+ starter[i] +");");
//                     connection.query("INSERT INTO JoueurCarteDeck(qteCarteDeck, id_Deck, Pseudo, id_Carte) VALUES (1, "+connection.escape(obj.pseudo+'1')+","+connection.escape(obj.pseudo)+","+ starter[i] +");");
//                     connection.query("INSERT INTO JoueurCarteDeck(qteCarteDeck, id_Deck, Pseudo, id_Carte) VALUES (1, "+connection.escape(obj.pseudo+'2')+","+connection.escape(obj.pseudo)+","+ starter[i] +");");
//                }

//                 connection.query("INSERT INTO posséderIconeJoueur(Pseudo,id_IconeJoueur) VALUES ("+connection.escape(obj.pseudo)+",0)");

//                 connection.query("INSERT INTO posséderSkinMap(Pseudo,id_SkinMap) VALUES ("+connection.escape(obj.pseudo)+",0)");

//                 connection.query("INSERT INTO posséderSkinCartonCarte(Pseudo,id_SkinCartonCarte) VALUES ("+connection.escape(obj.pseudo)+",0)");

//                 sock.emit("CREATE_ACCOUNT_SUCCESS", 0);
// }


// var express      = require('express')
// var cookieParser = require('cookie-parser')

// var app = express()
// app.use(cookieParser())

// app.get('/Account', function(req, res) {
//   req.cookies = cookieParser.JSONCookie("Salut : salut");
//   res.send("You're Awesome.");
// });
// app.get('/Boutique', function(req, res) {
//   res.send('What a radical visit! \n : ' + cookieParser.JSONCookie(req.cookies));
// });
// app.get('/AccountCreate', function(req, res) {
//   res.send('Are you a surfer?');
// });
// //If you host the application on Modulus the PORT environment variable will be defined,
// //otherwise I’m simply using 8080.
// app.listen(process.env.PORT || 8080);


var express = require('express');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var path = require('path');
var app = express();
var server = require('http').Server(app);
var socket = require('socket.io')(server);



// must use cookieParser before expressSession
app.use(cookieParser());

app.use(expressSession({secret:'somesecrettokenhere'}));

app.use(bodyParser());

app.use(express.static(path.resolve('../')));

app.set('view engine', 'jade');
app.set('views', '../views');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  res.render('Account');
});


app.get('/Account', function (req, res) {
     res.render('Account', req.session.account);
});

app.get('/Decks', function (req, res) {
  if(req.session.account == null)
    res.render('Account');
  else
    recuperation_deck(req,res);
});

app.get('/AccountCreate', function (req, res) {
     res.render('AccountCreate');
});

app.get('/Game', function(req, res){
  if(req.session.account == null){
    res.render('Account');
  }
  else {
    res.render('LiveGame',req.session.account);
  }
});

app.post('/Account', function (req, res) {

 authentification(req.param("signin_pseudo"), req.param("signin_password"),req,res);

 // req.session.account = {pseudo : req.param("signin_pseudo")};
 // req.session.save( (err) => {} );
 // res.render('Account', req.session.account);
});


// pour vider le cookie (pseudo connecté persistant) et tester
app.get('/clear', function(req, res){
  req.session.account = null;
  req.session.save( (err) => {} );
  console.log(req.session);
  res.render('Account', req.session.account);
});

/* interrogation de la BDD */


function authentification(pseudo, password,req,res){
  bdd_connect();
  var query = "SELECT Pseudo FROM CompteJoueur WHERE (Pseudo LIKE "+connection.escape(pseudo)+" AND mdpCompte LIKE "+connection.escape(password)+");";

  connection.query(query, function(err, rows, fields){
    if (err) throw err;
    if(rows.length != 0){
        req.session.account = {'pseudo' : req.param("signin_pseudo"), 'password' : req.param("signin_password")};
        req.session.save( (err) => {} );
        res.render('Account', req.session.account);
    }
    else{
        req.session.account = {'pseudo' : undefined};
        req.session.save( (err) => {} );
        res.render('Account', req.session.account);
    }
  });
  connection.end();

}

function recuperation_deck(req, res){

  bdd_connect();

  var deck0 = req.session.account.pseudo+"0";
  var deck1 = req.session.account.pseudo+"1";
  var deck2 = req.session.account.pseudo+"2";
  var query1 = "SELECT Carte.* FROM CompteJoueur JOIN JoueurCarteDeck USING (Pseudo) JOIN Deck USING (id_Deck) JOIN Carte USING (id_carte) WHERE (id_Deck LIKE "+connection.escape(deck1)+")";
  var query2 = "SELECT Carte.* FROM CompteJoueur JOIN JoueurCarteDeck USING (Pseudo) JOIN Deck USING (id_Deck) JOIN Carte USING (id_carte) WHERE (id_Deck LIKE "+connection.escape(deck2)+")";
  var query0 = "SELECT Carte.* FROM CompteJoueur JOIN JoueurCarteDeck USING (Pseudo) JOIN Deck USING (id_Deck) JOIN Carte USING (id_carte) WHERE (id_Deck LIKE "+connection.escape(deck0)+")";

  var listeCarte1 = [];
  var listeCarte2 = [];
  var inventaire1 = [];
  var inventaire2 = [];

  connection.query(query0, function(err, rows, fields){
    if (err) throw err;
    for(var i=0; i<rows.length ; i++){
      inventaire1.push(rows[i]);
      inventaire2.push(rows[i]);
    }
  });


  connection.query(query1, function(err, rows, fields){
    if (err) throw err;
    for(var i=0; i<rows.length ; i++){
      listeCarte1.push(rows[i]);
      for(var j=0 ; j<inventaire1.length ; j++){
        if(inventaire1[j].id_Carte == listeCarte1[i].id_Carte){
          inventaire1.splice(j,1);
        }
      }
    }
  });


  connection.query(query2, function(err, rows, fields){
    if (err) throw err;
    for(var i=0; i<rows.length ; i++){
      listeCarte2.push(rows[i]);
      for(var j=0 ; j<inventaire2.length ; j++){
        if(inventaire2[j].id_Carte == listeCarte2[i].id_Carte){
          inventaire2.splice(j,1);
        }
      }
    }
    res.render('DeckManager',{'session':req.session, 'deck1': listeCarte1, 'deck2': listeCarte2, 'inventaire1': inventaire1, 'inventaire2': inventaire2});

  });

  connection.end();

}

/* partie socket io */

socket.on('connection', function(socket){
  console.log('client connected !');
  socket.on('SWAP_CARD',function(obj){
    var query = "UPDATE JoueurCarteDeck SET id_Carte = "+obj.carte_inventaire+" WHERE (id_Carte = "+obj.carte_deck+" AND id_deck LIKE "+connection.escape(obj.deck)+");";
    console.log(query);
    bdd_connect();
    connection.query(query);
    connection.end();
  });
  socket.on('SWAP_DECK',function(obj){
    var query = "UPDATE Deck SET estActif = 1 WHERE id_Deck LIKE "+connection.escape(obj.actif)+";";
    bdd_connect();
    connection.query(query);
    query = "UPDATE Deck SET estActif = 0 WHERE id_Deck LIKE "+connection.escape(obj.disable)+";";
    connection.query(query);
    connection.end();

  });
  socket.on('CREATE_ACCOUNT_CHECK', function(account){


    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if((account.mdp != account.mdp_confirm) || account.pseudo.length <= 0 || !re.test(account.email)){
      socket.emit('CREATE_ACCOUNT_CHECK_FAIL_ALREADYEXIST');
    }

    bdd_connect();
    var query = "SELECT Pseudo FROM CompteJoueur WHERE (mailCompte LIKE "+connection.escape(account.email)+");";
    connection.query(query,function(err,rows,fields){
      if(rows.length != 0){
        socket.emit('CREATE_ACCOUNT_CHECK_FAIL_ALREADYEXIST');
      }
      else {
        query = "SELECT Pseudo FROM CompteJoueur WHERE (Pseudo LIKE "+connection.escape(account.pseudo)+");";
        connection.query(query, function(err,rows,fields){
          if(rows.length != 0){
            socket.emit('CREATE_ACCOUNT_CHECK_FAIL_ALREADYEXIST');
          }
          else {
            socket.emit('CREATE_ACCOUNT_CHECK_SUCCESS');
          }
        });
      }
    });
    connection.end();
  });
});


/* only for socket.io purpose */
server.listen(3000);
app.listen(8080);
