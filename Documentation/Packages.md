<h1 align="center"> DROP DA BOMB </h1>

# Les packages et technologies utilisés

1. [Socket.io](#socketio)
2. [Express](#express)
3. [MySQL](#mysql)
4. [Jade](#jade)


## Socket.io 

Le module [**Socket.io**](https://socket.io/) est surement la raison principale dans le choix de la technologie (Node.js) de notre projet. S'il existais de nombreuses solutions pour atteindre notre objectif (PHP, JAVAEE, etc..), aucune ne présentait les avantages non-négligeables de Node. 

Le premier concerne les performances ; les échanges **asynchrones** client/serveur avec node+socket.io sont des plus rapides. 

Le second concerne le langage lui-même ; le javascript est un langage que nous apprécions, et nous avions vraiment envie de tenter un developpement "full-JS" (client et serveur). 

Le troisième concerne l'environnement lui-même ; Node, et ses modules, permettent de créer une architecture complète de serveur, sur lequel le developpeur à un contrôle total. De la gestion des routes, à la communication via socket, en passant par le moteur de templating, cet environnement permet de developper sur-mesure et c'est exactement ce dont nous avions besoin pour notre projet. 

Et tout cela sans compter la legereté du developpement lui-même ; un editeur de texte, une console node et en quelques secondes on peut lancer, couper, relancer le serveur. C'est un advantage considérable quand on sait qu'avec JAVA EE par exemple, le simple "test" de notre programme prends plusieurs secondes et de nombreux fichiers générés, à chaque fois...


Socket.io est un outil fantastique pour qui veut developper des applications web "temps-réel" et des communications connectées multi-utilisateur ; et c'est exactement notre cas.
Nous souhaitons faire un jeu en ligne, performant, qui permet à deux joueurs de se connecter pour s'affronter et Socket.io nous permet de :
- Envoyer facilement des messages à un client depuis le serveur, ou inversement
- Traiter facilement un message reçu
- Gérer la connexion/deconnexion d'un client
- Créer des salons d'utilisateurs (deux dans notre cas)

L'envoi des "messages" étant au format JSON il est posible d'y stocker des informations sans limite et en utilisant une structure aussi complexe que nécéssaire. 
Présentons rapidement le fonctionnement de notre serveur de jeu : Depuis le site (serveur web), lorsque le client appuie sur "Jouer", on lui renvoi la page à charger (l'interface du jeu) qui contient la ligne suivante : 
``` javascript
    var socket = io.connect('http://217.182.69.175:3001');
``` 
Il se connecte donc à notre serveur de jeu. Ce dernier mémorise sa socket, la relation qui lie le client et le serveur donc, et le place dans une *room* (un salon) non-complète.
Lorsqu'un second joueur se connecte, la *room* est complète et le jeu se lance pour les deux utilisateurs. 

Du coté du serveur on va utiliser les structure suivantes : 

``` javascript
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
```

La structure etatMatch comme son nom l'indique represente l'etat d'un match, et la structure etatJoueur l'etat d'un joueur. Le serveur règule donc la partie en fonction des mécaniques de jeu fixée, et adopte différents comportements selon la situation : 
- Envoi un message à tous les salons (fin de tour par exemple, le serveur possède une horloge générale et commune à toutes les parties) 
- Envoi un message au salon spéficique (fin de partie par exemple, pour annoncer aux deux joueurs le gagnant)
- Envoi un message à chaque utilisateurs d'un salon (carte jouée par exemple, on renvoi alors à chaque joueur son etatJoueur)

Dans le dernier cas, afin de prévenir certains "hacks", on ne renvoie pas entièrement l'etatMatch aux deux joueurs, mais seulement leurs etatJoueur respectifs afin que le javascript coté client se charge de mettre à jour l'interface du jeu en conséquence. Encore une fois, il est très facile de transmettre des structures comme etatJoueur qui possedent plusieurs attributs et tableaux, puisque l'encodage se fait en JSON. Du coté du receveur il est également très facile de manipuler les données reçues. 

Pour résumer, Socket.io nous permet d'avoir un jeu performant via une programmation aynschrone et non-bloquante ; ainsi pour le client tout est invisible, il voit juste un jeu qui réagit et évolue, alors qu'en réalité des milliers de messages sont transmis durant une partie. Chaque fois que le joueur fait une action, il envoi un message au serveur pour décrire cette action, le serveur vérifie si l'action était possible/légitime, si c'est le cas, il met à jour la configuration du match et prévient les deux joueurs de la nouvelle configuration et donc du contenu à afficher à l'écran. 

Exemples : 

Coté serveur : 
``` javascript
 socket.on('useCard', function(action){ 
     ...
 }
 ``` 

``` javascript
 socket.on('chercherMatch',function(pseudo){
     ...
 }
 ``` 

Coté client : 
``` javascript
socket.emit('useCard',{'id_carte' : CARD_ECHANGE_FORCE, 'pseudo' : Joueur, 'carte_cible' : (value[value.length-1]-1), 'pos_carte' : pos_carte_selection});
 }
 ``` 
## Express 

Le module [**Express**](http://expressjs.com/fr/) est probablement le module le plus populaire et le plus utilisé pour Node. 
Nous avons vu dans la section précédente que si la plateforme Node est en soi un noyau simple et aux fonctionnalités limités, elle devient en revanche d’une incroyable puissance si on prend en compte les modules que l’on peut y ajouter. Express apparait comme l’un de ces modules qui rend Node si populaire, puissant et agréable à utiliser ; ce module agit comme une « surcouche » et permet d’ajouter (et/ou remplacer) des fonctionnalités très intéressantes à notre serveur. 
NB : Express est lui-même un module « décomposé », qui est livré avec un certain nombre de fonctionnalités et qui peut être « augmenté » par de nombreux et divers sous-modules. Pour plus d’informations au sujet de ce module, ses possibilités et ses « sous-modules » nous vous invitons à consulter la page officielle du package, dont le lien est fourni dans la section finale « Bibliographie ». 
Nous présenterons uniquement les deux fonctionnalités utilisées dans le cadre de notre serveur. 

#### La gestion des routes (URLs)
La première concerne la **« gestion des routes »**. En effet, Node seul permet de servir les fichiers au client à partir d’une requête précise, mais force est de reconnaitre que cela devient relativement compliqué et peu pratique lorsque les différentes requêtes à traiter se multiplient et se complexifient. Express (et c’est là une des raisons de sa popularité) permet de gérer tout cela de manière simplifiée et automatisée avec un système de routes. 
Ainsi en deux lignes seulement on peut indiquer au serveur « Pour cette requête, envoie ce fichier».

Initialisation : 

``` javascript
    var express = require('express');
    var app = express();
```

(Exemple) Lorsque l’utilisateur veut accéder à monSite/Account, on lui renvoie la page générée apres "rendering" du fichier Account (voir la section [Jade](#jade)) :

``` javascript
    app.get('/Account', function(req,res){
        res.render('Account');
    });
```

 On fait cela pour toutes les routes, tous les fichiers, que l’on souhaite desservir au client.
Un autre aspect incroyable du système de routes par Express est la gestion des ressources liées auxdits fichiers. En effet, avec Node seul si on renvoi une page, disons index.html, mais que celle-ci importe 2 scripts, 2 images et 3 feuilles de styles, on doit alors créer un « chemin » pour chacun de ces fichiers, les ouvrir et les renvoyer en adaptant précisément le contenu de la requête de renvoi. 
    C’est terriblement lourd et complexe à gérer manuellement.

Avec Express, encore une fois, on peut le faire en… 1 ligne seulement : 

``` javascript
        app.use(express.static(path.resolve('../')));
```

Il suffit de préciser un répertoire par défaut, dans lequel on mettra tous les fichiers que le client est en mesure d’exiger, et Express se chargera de les envoyer si la page demandée par le client est liée à un ou plusieurs de ces fichiers.
Il existe d’autres manières, simples également, de gérer des cas plus complexes (plusieurs dossiers de fichiers à servir par défaut par exemple) mais dans notre cas cette solution est adaptée et idéale.

#### Les cookies (variables de session)
La deuxième fonctionnalité qui nous intéresse avec Express est liée aux cookies, ou pour être exact aux **«variables de session»**. En effet, on souhaite pouvoir conserver des informations pour une session d’utilisation (une session commence lors d’une visite depuis une IP X avec un navigateur Y). 
Ainsi, on peut gérer le cas suivant : une fois que l’utilisateur s’est identifié, il peut naviguer sur le site en restant connecté. S’il accède à la section « Compte » on lui affiche non pas la page d’accueil mais la page « Mon compte » avec toutes ses informations personnelles, par exemple.  

Initialisation : 
``` javascript
        var bodyParser = require('body-parser');
        var expressSession = require('express-session');
        var cookieParser = require('cookie-parser');

        app.use(bodyParser());
        app.use(expressSession({secret:'somesecrettokenhere'}));
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));
```


## MySQL

Le module [**MySQL**](https://www.npmjs.com/package/mysql) est comme son nom l’indique un module qui permet de travailler avec une base de données MySQL.
Dans notre projet nous nous en servons essentiellement pour faire des requêtes à la base de données, notamment dans les situations suivantes : 
-	Vérifier les informations de connexion d’un client
-	Ajouter un compte client après vérification du formulaire d’inscription
-	Modification d’un deck 
-	Afficher les informations d’un compte 
-	Récupérer le contenu du Deck actif pour la participation d’un joueur à un match

Le fonctionnement d’une transaction est des plus classiques.

(Exemple) On commence par créer une « connexion » : 

``` javascript
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host : xxx.xxx.xxx.xxx,
        user : xxxxx,
        password : xxxx,
        database : xxxxxx,
    });
```

(Exemple) On prépare une requête : 

``` javascript
   var query0 = "SELECT Carte.* FROM CompteJoueur JOIN etc..";
```

(Exemple) Puis on envoi cette requête, on traite les éventuelles erreurs et on traite le résultat (stocké sous forme d’un tableau de lignes) :

``` javascript
    connection.query(query0, function(err, rows, fields){
        if(err) throw err;
        for(var i=0; i<rows.length; i++)
            inventaire.push(rows[i]);
    });
```


## Jade


Le module [**Jade**](https://www.npmjs.com/package/jade) est un moteur de *templating* crée essentiellement pour être utilisé en collaboration avec Node. Si Node remplace les langages coté serveur les plus puissants comme PHP, il demeure certain aspect pour lesquels Node est « incompétent ». 

Dans notre situation (on rappelle que l’on souhaite développer un client et un serveur uniquement basé sur Javascript) Jade apparait comme une merveilleuse solution. En effet, pour servir au client des pages dynamiques (pas des pages avec du contenu dynamique, on parle ici de pages dont le contenu est différent selon le contexte) Node seul ne propose aucune solution viable. 

Jade permet donc d’écrire des pages .jade qui seront compilées par le moteur de « rendering » de Node qui les « traduira » en du pur HTML à renvoyer au client. De plus, on peut fournir à ce moteur de rendering des informations, au format JSON, qui seront donc traitable via le code Jade.

La syntaxe de Jade intègre donc tous les composants du HTML, en rajoutant la plupart des composantes algorithmiques classiques telles que les structures de contrôle, les boucles et les variables. De plus la syntaxe de Jade est simple, claire et permet même une productivité accrue dans l’écriture de pages HTML. 

En guise d’exemple, on va parler du cas de la page Account(ou plutôt de la « route », voir la section [Express](#express)). La partie de notre site relative aux Comptes comporte deux aspects :
-	L’accueil (« se connecter ou créer un compte »)
-	L’affichage de « mon compte »

Si on utilise Node seul, l’unique solution qui s’offre à nous est de disposer de différentes routes tels que *« monSite/AccountMenu »* et *« monSite/AccountHome »* avec leurs fichiers propres.
Cette solution n’est pas idéale, on aimerait disposer d’une seule route *« monSite/Account »* qui affiche le contenu adapté selon le contexte (afficher les informations de mon compte quand je suis connecté, une page de sign-in/sign-up sinon). 
Avec Jade et l’utilisation des *« cookies »* (variables de session, voir la section [Express](#express)) on a donc la structure suivante : 

La route Account qui dispose d’un simple « renvoi » de la page Account.jade : 

``` javascript
       app.get('/Account', function(req,res){
           res.render('Account', req.session.account);
       });
```

Cette page contient les quelques lignes suivantes : 

``` javascript
    html
        head
            include templates/template_head

        body
            include templates/template_nav

            #GUI_CONTENT.row
                if pseudo == undefined
                    include AccountMenu.jade
                else
                    include AccountHome.jade
``` 

On constate ainsi trois choses : 
-	Avec Jade on peut inclure du code d’autres fichiers .jade, ainsi on peut alléger le code et le rendre plus universel en « exportant » les portions de code communes à toutes les pages, comme c’est le cas pour une partie de la section « head » (importation des feuilles de style, de jquery, etc..) 

-	Dans la partie « contenu » de notre code HTML (#GUI_CONTENT) à renvoyer on ajoute soit le contenu du fichier AccountMenu.jade soit de AccountHome.jade selon que l’utilisateur s’est déjà connecté ou non. 

- Une syntaxe allegée (par rapport au HTML classique) et lisible

Dans les pages AccountMenu.jade et AccountHome.jade on a le code HTML (Jade en l’occurrence, mais qui sera traduit en du HTML) qui correspond aux pages « Se connecter ou créer un compte » et « Mon compte ». 

En résumé, les principales caractéristiques de Jade sont : 
-	Syntaxe très claire et simplifiée 
-	Traitements algorithmiques tels que les boucles ou les tests
-	Passage d’informations utilisables dans le code Jade au format JSON lors du rendering
-	Possibilité de découper le code et de créer des portions réutilisables via les « include »

