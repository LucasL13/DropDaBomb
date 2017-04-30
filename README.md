<h1 align="center"> DROP DA BOMB </h1>

1. [Le jeu](#le-jeu)
2. [Utilisation du site](#utilisation-du-site)
3. [Les Regles](Documentation/LesRegles.md)
4. [Les Cartes](Documentation/LesCartes.md)
5. [L'interface](Documentation/Interface.md)
6. [Les packages et technologies utilisés](Documentation/Packages.md)
7. [Les aspects techniques](Documentation/Technique.md)
8. [La gestion de projet](Documentation/GestionProjet.md)
9. [Les fonctionnalités](#les-fonctionnalités)
10. [La base de données](Documentation/BDD.md)

## Le jeu 

Drop Da Bomb est un jeu de plateau/cartes en ligne.
Il se base sur un ensemble de cartes (Cartes) collectionnables (**Inventaire**) par un joueur (**Compte**) afin de composer une ou plusieurs « main de jeu » (**Deck**). 
Ces cartes peuvent être obtenues de diverses manières mais principalement via la boutique (**Shop**) qui permet d’acheter avec différentes monnaies des lots de cartes (**Packs**). Il existe différents types et raretés pour les cartes. 
Une partie (**Match**) oppose deux joueurs, dans une arène spécifique avec des règles et des modes de jeu précis ; à tour de rôle les joueurs peuvent utiliser les cartes de leur Deck alors en main pour tenter de faire basculer l’objectif (« la bombe ») dans le camp de leur adversaire. 
Si la bombe explose ou se trouve dans le camp d’un joueur à la fin du temps imparti, la partie est perdue par celui-ci ; elle est gagnée par l’autre qui pourra alors remporter des récompenses (Cartes, Monnaie Virtuelle, etc..).

Ce jeu s’inspire par moments des jeux du même type devenus aujourd’hui des grands classiques (Yu-Gi-Oh, Clash Royale, HearthStone) mais se démarque par bien des aspects afin de se créer une véritable identité, un gameplay unique et tente de se faire sa place parmi les classiques cités précédemment. 

Ce projet concerne donc la réalisation de ce jeu ainsi que de toutes ses composantes à savoir : 
-	Réalisation du jeu pour clients web
-	Réalisation d’une interface de gestion pour clients web
-	Réalisation d’une interface web pour administrateurs (optionnel)
A plus long terme, les objectifs sont de développer une version « application » pour smartphones, ainsi que de maintenir et faire évoluer le jeu au travers de nouveaux contenus, nouveaux modes de jeux, évènements, etc... 


## Utilisation du site

>Les deux serveurs (web & jeu) sont situés sur un serveur administré par l'un des membres du groupe. 

> Cela permet un accès distant au site et un fonctionnement 24/24 7/7. 

Si vous êtes un nouvel utilisateur, voici comment jouer en quelques étapes seulement : 

1. Se connecter au site : [DDB](http://217.182.69.175:8081/Account)
2. Créer son compte 
3. Jouer en cliquant sur le bouton "Jouer" de la barre de navigation

+ Modifier son deck lorsque vous aurez acquis de nouvelles cartes dans la section **"Decks"**

## Les fonctionnalités 

Nous avons pour ce projet des ambitions qui sont au-delà des objectifs fixés dans le cadre de projets scolaires. 

Les fonctionnalités implementées representent déjà une charge de travail et de compétences important, et la catégorie des fonctionnalités *"A venir"* ne sont pas à interpreter au sens "fonctionnalités que nous n'avons pas eu le temps de developper", mais bien au sens "fonctionnalités que nous visons à moyen et long terme pour aboutir à un site et un jeu d'une qualité quasi-professionnelle.

Pour l'heure actuelle, nous avons un site qui permet de se connecter, de voir et modifier son deck et de lancer une partie. 
Le client de jeu est fonctionnel et le jeu également. Des améliorations notamment au niveau du design et du coté "responsive" sont à venir, car il est évidemment que le jeu fait pour l'instant très "amateur". 

### Implementées

- [x] Interface web de connexion
- [x] Interface web de visualisation et de modification des decks
- [x] Matchmaking (8 salons - 16 joueurs max)
- [x] Client de jeu 

### En cours d'implementation

* Interface web de création de compte

### A venir 

* Interface web avancée pour la gestion de compte
* Interface web pour les administrateurs
* Interface web pour la Boutique
* Amélioration de l'UI du jeu 
* Creation de nouveaux contenus (cartes, modes de jeu, icônes, etc..)
