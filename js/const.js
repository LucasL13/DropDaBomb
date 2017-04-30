// CONSTANTES "ECRAN" PRINCIPALES 

// Largeur de l’écran du client
var ScreenW = $(window).width();
// Hauteur de l’écran du client
var ScreenH = $(window).height();

// Largeur de la zone globale du jeu
var ZoneW = ScreenW;
// Hauteur de la zone globale du jeu
var ZoneH = ScreenH;

//Proportion de la zone globable de jeu si (ScreenW>ScreenH)
var ZoneRatio = 0.4;



// OBJETS CONTAINERS BLOCS JEU


var ZONE_ADVERSAIRE = { 
                        'background' : "#bcaaa4",
                        'id': "#zone_adv"
                    };

var ZONE_JEU = {
                    'background' : "#7cb342",
                    'id' : "#zone_jeu"
                };

var ZONE_DECK  = { 
                    'background' : "#795548",
                    'id' : "#zone_deck"
                };

var ZONE_OBJECTS = new Array(ZONE_ADVERSAIRE, ZONE_JEU, ZONE_DECK);



// Fonctions utiles

function setZoneSize(){
    if(ScreenW > ScreenH)
        ZoneW = ZoneW * ZoneRatio;    
    
    $("#zone").css("width", ZoneW + "px");
    $("#zone").css("height", ZoneH + "px");
}

function setZoneObjects(){ 
    for(var i=0; i < ZONE_OBJECTS.length; i++){
        var tmp = ZONE_OBJECTS[i];
        $(tmp.id).css("background-color", tmp.background);
    }
}