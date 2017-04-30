/* constantes */


var NB_MAX_PDV_BATIMENT = 50;
var NB_MAX_PDV = 150;
var CARD_DESENVOUTEMENT = 8;
var CARD_ECHANGE_FORCE = 7;
var CARD_BOMB_25 = 0;
var CARD_BOMB_50 = 1;
var CARD_UPGRADE = 11;



/* ********** */


/* mise en place des handlers */

// $('.card_clickable').on("click", utiliserCarte);



/*****************************/

//var socket = io.connect('http://192.168.43.7:8080');
//var socket = io.connect('http://109.7.220.208:3000');

var socket = io.connect('http://localhost:3001');


var Joueur;    //Récup le pseudo du guguss

var etatJoueur;
var actifAdversaire;
var carteJoue;
var FLAG_FIN_PARTIE = false;
var vainqueur;
var pos_carte_selection;

var pdvJoueurPrec = 150;
var pdvAdversairePrec = 150;
var bouclierAdversairePrec = 0;
var bouclierJoueurPrec = 0;
var poudreJoueurPrec = 0;
var carte_degat_selectionne = -1;


$(document).ready(function(){
  card_desenvoutement();

});

function handleSelectCardEffectUpgrade(val){
  var value = $(this).attr('id');

  $('#zone_select_card_effect').removeClass('pop_select_card_effect');
  $('#zone_select_card_effect').addClass('out_select_card_effect');
  $('#zone_barre').css({'opacity': 1});
  $('#zone_jeu').css({'opacity': 1});
  $('#zone_deck').css({'opacity': 1});

  $("#zone_select_card_effect").hide();


  socket.emit('useCard',{'id_carte' : CARD_UPGRADE, 'pseudo' : Joueur, 'carte_cible' : (value[value.length-1]-1), 'pos_carte' : pos_carte_selection});
  console.log({'id_carte' : CARD_UPGRADE, 'pseudo' : Joueur, 'carte_cible' : (value[value.length-1]-1), 'pos_carte' : pos_carte_selection});


}


function card_upgrade(){
  var width = $('#zone').width();
  var height = $(document).height();

  $('#zone_select_card_effect_container').show();

  /* dessin du modal */



  $("#zone_select_card_effect_container").html(
    '<img id=\"zone_select_card_effect_card1\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card2\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card3\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card4\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card5\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">'
  );

  $("#zone_select_card_effect_card1").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card2").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card3").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card4").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card5").css({'width': '20%', 'height': '20%'});




  for(var i=0;i<etatJoueur.carteActiveNonRetourne.length;i++){
    if(etatJoueur.carteActiveNonRetourne[i].typeCarte == 'batiment'){
      $('#zone_select_card_effect_card'+(i+1)).attr('src',"img/"+etatJoueur.carteActiveNonRetourne[i].imageCarte);
      $('#zone_select_card_effect_card'+(i+1)).on('click',handleSelectCardEffectUpgrade);
      $('#zone_select_card_effect_card'+(i+1)).addClass("card_clickable");
    }
    else {
      $('#zone_select_card_effect_card'+(i+1)).attr('src','img/CARD_DEFAULT_VERSO.png');
      $('#zone_select_card_effect_card'+(i+1)).off('click',handleSelectCardEffectUpgrade);
      $('#zone_select_card_effect_card'+(i+1)).removeClass("card_clickable");
    }
  }
  for(var i=etatJoueur.carteActiveNonRetourne.length;i<5;i++){
    $('#zone_select_card_effect_card'+(i+1)).attr('src','img/CARD_DEFAULT_VERSO.png');
    $('#zone_select_card_effect_card'+(i+1)).off('click',handleSelectCardEffectUpgrade);
    $('#zone_select_card_effect_card'+(i+1)).removeClass("card_clickable");
  }

  /*******************/



  $("#zone_select_card_effect").show();


  $('#zone_select_card_effect').css({'opacity': 0.95, 'width': width+"px", 'height': (height*0.2)+"px",'top': height/2-((height*0.3)/2)});
  $('#zone_select_card_effect').removeClass('out_select_card_effect');
  $('#zone_select_card_effect').addClass('pop_select_card_effect');
  $('#zone_barre').css({'opacity': 0.3});
  $('#zone_jeu').css({'opacity': 0.3});
  $('#zone_deck').css({'opacity': 0.3});


}

function handleSelectCardEffectBatiment(val){
  var value = $(this).attr('id');

  $('#zone_select_card_effect').removeClass('pop_select_card_effect');
  $('#zone_select_card_effect').addClass('out_select_card_effect');
  $('#zone_barre').css({'opacity': 1});
  $('#zone_jeu').css({'opacity': 1});
  $('#zone_deck').css({'opacity': 1});

  $("#zone_select_card_effect").hide();
  $("#zone_select_card_effect_direct").hide();


  if(val == -1){
    socket.emit('useCard',{'id_carte' : carte_degat_selectionne, 'pseudo' : Joueur, 'carte_cible' : -1, 'pos_carte' : pos_carte_selection});
    console.log({'id_carte' : carte_degat_selectionne, 'pseudo' : Joueur, 'carte_cible' : -1, 'pos_carte' : pos_carte_selection});
  }
  else {
    socket.emit('useCard',{'id_carte' : carte_degat_selectionne, 'pseudo' : Joueur, 'carte_cible' : (value[value.length-1]-1), 'pos_carte' : pos_carte_selection});
    console.log({'id_carte' : carte_degat_selectionne, 'pseudo' : Joueur, 'carte_cible' : (value[value.length-1]-1), 'pos_carte' : pos_carte_selection});
  }



}

function card_batiment(){
  var width = $('#zone').width();
  var height = $(document).height();

  $('#zone_select_card_effect_container').show();

  /* dessin du modal */



  $("#zone_select_card_effect_container").html(
    '<img id=\"zone_select_card_effect_card1\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card2\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card3\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card4\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card5\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">'
  );

  $("#zone_select_card_effect_card1").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card2").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card3").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card4").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card5").css({'width': '20%', 'height': '20%'});




  for(var i=0;i<actifAdversaire.length;i++){
    if(actifAdversaire[i].typeCarte == 'batiment'){
      $('#zone_select_card_effect_card'+(i+1)).attr('src',"img/"+actifAdversaire[i].imageCarte);
      $('#zone_select_card_effect_card'+(i+1)).on('click',handleSelectCardEffectBatiment);
      $('#zone_select_card_effect_card'+(i+1)).addClass("card_clickable");
    }
    else {
      $('#zone_select_card_effect_card'+(i+1)).attr('src','img/CARD_DEFAULT_VERSO.png');
      $('#zone_select_card_effect_card'+(i+1)).off('click',handleSelectCardEffectBatiment);
      $('#zone_select_card_effect_card'+(i+1)).removeClass("card_clickable");
    }
  }
  for(var i=actifAdversaire.length;i<5;i++){
    $('#zone_select_card_effect_card'+(i+1)).attr('src','img/CARD_DEFAULT_VERSO.png');
    $('#zone_select_card_effect_card'+(i+1)).off('click',handleSelectCardEffectBatiment);
    $('#zone_select_card_effect_card'+(i+1)).removeClass("card_clickable");
  }

  /*******************/



  $("#zone_select_card_effect").show();
  $("#zone_select_card_effect_direct").show();

  $('.zone_select_card_effect_direct_img').css({'width': (width*0.3)});
  $('#zone_select_card_effect_direct').css({'opacity': 0.95,'left': (($(document).width()/2)-((width*0.3)/2))});
  $('#zone_select_card_effect_direct').removeClass('out_select_card_effect');
  $('#zone_select_card_effect_direct').addClass('pop_select_card_effect');

  $('#zone_select_card_effect').css({'opacity': 0.95, 'width': width+"px", 'height': (height*0.2)+"px",'top': height/2-((height*0.3)/2)});
  $('#zone_select_card_effect').removeClass('out_select_card_effect');
  $('#zone_select_card_effect').addClass('pop_select_card_effect');
  $('#zone_barre').css({'opacity': 0.3});
  $('#zone_jeu').css({'opacity': 0.3});
  $('#zone_deck').css({'opacity': 0.3});


}

function handleSelectCardEffectEchangeForce(){
  var value = $(this).attr('id');

  console.log("id = "+(value[value.length-1]-1));

  $('#zone_select_card_effect').removeClass('pop_select_card_effect');
  $('#zone_select_card_effect').addClass('out_select_card_effect');
  $('#zone_barre').css({'opacity': 1});
  $('#zone_jeu').css({'opacity': 1});
  $('#zone_deck').css({'opacity': 1});

  $("#zone_select_card_effect").hide();

  socket.emit('useCard',{'id_carte' : CARD_ECHANGE_FORCE, 'pseudo' : Joueur, 'carte_cible' : (value[value.length-1]-1), 'pos_carte' : pos_carte_selection});
}

function card_echange_force(){
  var width = $('#zone').width();
  var height = $(document).height();


  /* dessin du modal */

  $("#zone_select_card_effect_container").html(
    '<img id=\"zone_select_card_effect_card1\" src=\"img/CARD_DEFAULT_VERSO.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card2\" src=\"img/CARD_DEFAULT_VERSO.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card3\" src=\"img/CARD_DEFAULT_VERSO.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card4\" src=\"img/CARD_DEFAULT_VERSO.png\" class=\"zone_select_card_img card_clickable\">'
  );

  $("#zone_select_card_effect_card1").css({'width': '25%', 'height': '20%'});
  $("#zone_select_card_effect_card2").css({'width': '25%', 'height': '20%'});
  $("#zone_select_card_effect_card3").css({'width': '25%', 'height': '20%'});
  $("#zone_select_card_effect_card4").css({'width': '25%', 'height': '20%'});

  for(var i=1;i<5;i++){

    $('#zone_select_card_effect_card'+i).on('click',handleSelectCardEffectEchangeForce);

  }

  /*******************/



  $("#zone_select_card_effect").show();

  $('#zone_select_card_effect').css({'opacity': 0.95, 'width': width+"px", 'height': (height*0.2)+"px",'top': height/2-((height*0.3)/2)});
  $('#zone_select_card_effect').removeClass('out_select_card_effect');
  $('#zone_select_card_effect').addClass('pop_select_card_effect');
  $('#zone_barre').css({'opacity': 0.3});
  $('#zone_jeu').css({'opacity': 0.3});
  $('#zone_deck').css({'opacity': 0.3});
}

function modalSelectionHide(){
  $('#zone_select_card_effect').removeClass('pop_select_card_effect');
  $('#zone_select_card_effect').addClass('out_select_card_effect');
  $('#zone_barre').css({'opacity': 1});
  $('#zone_jeu').css({'opacity': 1});
  $('#zone_deck').css({'opacity': 1});
  $("#zone_select_card_effect").hide();
  $("#zone_select_card_effect_direct").hide();
}

function handleSelectCardEffectDesenvoutement(){

  var value = $(this).attr('id');

  console.log("id = "+(value[value.length-1]-1));

  $('#zone_select_card_effect').removeClass('pop_select_card_effect');
  $('#zone_select_card_effect').addClass('out_select_card_effect');
  $('#zone_barre').css({'opacity': 1});
  $('#zone_jeu').css({'opacity': 1});
  $('#zone_deck').css({'opacity': 1});

  $("#zone_select_card_effect").hide();
  console.log("modal emit !!!!");
  socket.emit('useCard',{'id_carte' : CARD_DESENVOUTEMENT, 'pseudo' : Joueur, 'id_carte_destroyed' : (value[value.length-1]-1), 'pos_carte' : pos_carte_selection});

}

function card_desenvoutement(){
  var width = $('#zone').width();
  var height = $(document).height();

  $('#zone_select_card_effect_container').show();

  /* dessin du modal */


  $("#zone_select_card_effect_container").html(
    '<img id=\"zone_select_card_effect_card1\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card2\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card3\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card4\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">' +
    '<img id=\"zone_select_card_effect_card5\" src=\"img/BOUCLIER_RENVOI.png\" class=\"zone_select_card_img card_clickable\">'
  );

  $("#zone_select_card_effect_card1").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card2").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card3").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card4").css({'width': '20%', 'height': '20%'});
  $("#zone_select_card_effect_card5").css({'width': '20%', 'height': '20%'});




  for(var i=0;i<actifAdversaire.length;i++){
    console.log('#zone_select_card_effect_card'+(i+1)+' '+actifAdversaire[i].imageCarte);
    $('#zone_select_card_effect_card'+(i+1)).attr('src',"img/"+actifAdversaire[i].imageCarte);
    $('#zone_select_card_effect_card'+(i+1)).on('click',handleSelectCardEffectDesenvoutement);
    $('#zone_select_card_effect_card'+(i+1)).addClass("card_clickable");
  }
  for(var i=actifAdversaire.length;i<5;i++){
    console.log("i = "+i);
    $('#zone_select_card_effect_card'+(i+1)).attr('src','img/CARD_DEFAULT_VERSO.png');
    $('#zone_select_card_effect_card'+(i+1)).off('click',handleSelectCardEffectDesenvoutement);
    $('#zone_select_card_effect_card'+(i+1)).removeClass("card_clickable");
  }

  /*******************/



  $("#zone_select_card_effect").show();

  $('#zone_select_card_effect').css({'opacity': 0.95, 'width': width+"px", 'height': (height*0.2)+"px",'top': height/2-((height*0.3)/2)});
  $('#zone_select_card_effect').removeClass('out_select_card_effect');
  $('#zone_select_card_effect').addClass('pop_select_card_effect');
  $('#zone_barre').css({'opacity': 0.3});
  $('#zone_jeu').css({'opacity': 0.3});
  $('#zone_deck').css({'opacity': 0.3});



}

function utiliserCarte(val,id_Carte){

  modalSelectionHide();

  console.log("val = "+val+" id_carte = "+id_Carte);

  function verifPoudre(){
    for(var i=0 ; i<etatJoueur.main.length;i++){
      if(id_Carte == etatJoueur.main[i].id_Carte && etatJoueur.main[i].cout <= etatJoueur.poudre)
        return true;
    }
    return false;
  }


  if(id_Carte >= 0){
    if(verifPoudre()){
        console.log("Pas assez de poudre !");
    }
    else {
      if(id_Carte == CARD_DESENVOUTEMENT){
        pos_carte_selection = val;
        card_desenvoutement();
      }
      else if(id_Carte == CARD_ECHANGE_FORCE){
        pos_carte_selection = val;
        card_echange_force();
      }
      else if(id_Carte == CARD_BOMB_25){
        pos_carte_selection = val;
        carte_degat_selectionne = CARD_BOMB_25;
        card_batiment();
      }
      else if(id_Carte == CARD_BOMB_50){
        pos_carte_selection = val;
        carte_degat_selectionne = CARD_BOMB_50;
        card_batiment();
      }
      else if(id_Carte == CARD_UPGRADE){
        pos_carte_selection = val;
        card_upgrade();
      }
      else {
        console.log(Joueur+"joue jouez "+id_Carte+" !");
        socket.emit('useCard',{'id_carte' : id_Carte, 'pseudo' : Joueur, 'pos_carte' : val});
      }

    }
  }
}

function chercherMatch(){
    Joueur = (document.getElementById('pseudo').value  !== null) ? document.getElementById('pseudo').value : 'TantPisPourToi';
    document.getElementById('attente').innerHTML = '<p>En attente !</p>';
    socket.emit('chercherMatch',Joueur);
}



function dessineMain(main){

  if(main[0] !== undefined){
    $('#zone_deck_cards_card1 img').attr('src','img/'+main[0].imageCarte);
    $('#zone_deck_cards_card1 img').attr('id',main[0].id_Carte);
    $('#zone_deck_cards_card1_powder').text(main[0].coutCarte);
  }
  else {
    $('#zone_deck_cards_card1 img').attr('src','img/CARD_DEFAULT_VERSO.png');
    $('#zone_deck_cards_card1 img').attr('id',-1);
    $('#zone_deck_cards_card1_powder').text('');

  }

  if(main[1] !== undefined){
    $('#zone_deck_cards_card2 img').attr('src','img/'+main[1].imageCarte);
    $('#zone_deck_cards_card2 img').attr('id',main[1].id_Carte);
    $('#zone_deck_cards_card2_powder').text(main[1].coutCarte);

  }
  else {
    $('#zone_deck_cards_card2 img').attr('src','img/CARD_DEFAULT_VERSO.png');
    $('#zone_deck_cards_card2 img').attr('id',-1);
    $('#zone_deck_cards_card2_powder').text('');

  }

  if(main[2] !== undefined){
    $('#zone_deck_cards_card3 img').attr('src','img/'+main[2].imageCarte);
    $('#zone_deck_cards_card3 img').attr('id',main[2].id_Carte);
    $('#zone_deck_cards_card3_powder').text(main[2].coutCarte);

  }
  else {
    $('#zone_deck_cards_card3 img').attr('src','img/CARD_DEFAULT_VERSO.png');
    $('#zone_deck_cards_card3 img').attr('id',-1);
    $('#zone_deck_cards_card3_powder').text('');

  }

  if(main[3] !== undefined){
    $('#zone_deck_cards_card4 img').attr('src','img/'+main[3].imageCarte);
    $('#zone_deck_cards_card4 img').attr('id',main[3].id_Carte);
    $('#zone_deck_cards_card4_powder').text(main[3].coutCarte);

  }
  else {
    $('#zone_deck_cards_card4 img').attr('src','img/CARD_DEFAULT_VERSO.png');
    $('#zone_deck_cards_card4 img').attr('id',-1);
    $('#zone_deck_cards_card4_powder').text('');

  }


}

function dessineBarreDeVie(etatJoueur,bouclierAdversaire){


  var pourcent_barre_verte = 98*etatJoueur.pdv/(NB_MAX_PDV*2+etatJoueur.bouclier+bouclierAdversaire);
  var pourcent_bouclier_joueur = 98*etatJoueur.bouclier/(NB_MAX_PDV*2+etatJoueur.bouclier+bouclierAdversaire);
  var pourcent_bouclier_adversaire = 98*bouclierAdversaire/(NB_MAX_PDV*2+etatJoueur.bouclier+bouclierAdversaire);
  var pourcent_barre_rouge = 98-(pourcent_barre_verte+pourcent_bouclier_joueur+pourcent_bouclier_adversaire);



  $('#zone_barre_barre_fond_left').css({'width' : pourcent_barre_verte+'%'});
  $('#zone_barre_barre_fond_bouclier_left').css({'width' : pourcent_bouclier_joueur+'%'});
  $('#zone_barre_barre_fond_bouclier_right').css({'width' : pourcent_bouclier_adversaire+'%'});
  $('#zone_barre_barre_fond_right').css({'width' : pourcent_barre_rouge+'%'});

  console.log("vie : "+etatJoueur.pdv);
  console.log("vie : "+etatJoueur.bouclier);


  $('#zone_barre_vie_left').html('<span class=\"white-text\">'+(etatJoueur.pdv+etatJoueur.bouclier)+'</span>(<span class = \"green-text\">'+etatJoueur.pdv+'</span> + <span class=\"purple-text\">'+etatJoueur.bouclier+'</span>)');

}

function dessineCarteCentre(carteJoue){

  $('#zone_jeu_card_middle_card').attr('src','img/'+carteJoue.imageCarte);
  $('#zone_jeu_card_middle_card').addClass('pop_card_center');

  $('.pop_card_center').one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
  function(e) {
      console.log("coucou l'anim est finie");
      $('#zone_jeu_card_middle_card').removeClass('pop_card_center');
  });
}


function dessineCartesActives(etatJoueur,actifAdversaire){

  var id, src, duree;
  var id_adv, src_adv, duree_adv;
  var zone, zone_adv;
  var selecteur, selecteurAdversaire;
  var overlay, overlay_adv;
  var rm_class = true;
  var percent;

  for(var i=0;i<5;i++){
    rm_class = true;
    selecteur = "#zone_jeu_cards_player_card"+(i+1)+" img";
    overlay_adv = "#zone_jeu_cards_adversaire_card"+(i+1)+" .jeu_cards_overlay";
    zone = "#zone_jeu_cards_player_card"+(i+1);

    overlay = "#zone_jeu_cards_player_card"+(i+1)+" .jeu_cards_overlay";
    selecteurAdversaire = "#zone_jeu_cards_adversaire_card"+(i+1)+" img";

    zone_adv = "#zone_jeu_cards_adversaire_card"+(i+1);


    if(actifAdversaire[i] === undefined){
      src_adv = "img/CARD_DEFAULT_VERSO.png";
      id_adv = -1;
      duree_adv = 0;
    }

    else{
      src_adv = "img/"+actifAdversaire[i].imageCarte;
      id_adv = actifAdversaire[i].id_carte;
      duree_adv = actifAdversaire[i].duree;
      if(actifAdversaire[i].typeCarte == 'batiment') {
        console.log("batiment detecté --------------------------");
        $('#jeu_cards_overlay_pdvadv_carte'+(i+1)).show();
        $('#jeu_cards_overlay_pdvadv_contour_carte'+(i+1)).show();
        percent = (100*actifAdversaire[i].pdv/NB_MAX_PDV_BATIMENT);
        $('#jeu_cards_overlay_pdvadv_carte'+(i+1)).css({'height': percent+'%'});
      }
      else {
        $('#jeu_cards_overlay_pdvadv_carte'+(i+1)).hide();
        $('#jeu_cards_overlay_pdvadv_contour_carte'+(i+1)).hide();
      }
      if(duree_adv == 0) rm_class = false;
    }


    if(etatJoueur.carteActiveNonRetourne[i] === undefined){
      src = "img/CARD_DEFAULT_VERSO.png";
      id = -1;
      duree = 0;
    }
    else{
      src = "img/"+etatJoueur.carteActiveNonRetourne[i].imageCarte;
      id = etatJoueur.carteActiveNonRetourne[i].id_carte;
      duree = etatJoueur.carteActiveNonRetourne[i].duree;
      if(etatJoueur.carteActiveNonRetourne[i].typeCarte == 'batiment') {
        console.log("batiment allié detecté --------------------------");
        $('#jeu_cards_overlay_pdv_carte'+(i+1)).show();
        $('#jeu_cards_overlay_pdv_contour_carte'+(i+1)).show();
        percent = (100*etatJoueur.carteActiveNonRetourne[i].pdv/NB_MAX_PDV_BATIMENT);
        $('#jeu_cards_overlay_pdv_carte'+(i+1)).css({'height': percent+'%'});
      }
      else {
        $('#jeu_cards_overlay_pdv_carte'+(i+1)).hide();
        $('#jeu_cards_overlay_pdv_contour_carte'+(i+1)).hide();
      }

    }


    $(selecteur).attr('src',src);
    $(selecteur).attr('id',id);
    $(overlay).text(duree);



    $(selecteurAdversaire).attr('src',src_adv);
    $(selecteurAdversaire).attr('id',id_adv);

    $(overlay_adv).text(duree_adv);

    $(zone_adv).addClass("boom");
    if(rm_class) $(zone_adv).removeClass("boom");

  }
}

function annoncerVictoire(){
  console.log("victoire");
  $('#modal_annonce_victoire').modal('open');
}

function annoncerDefaite(){
  console.log("defaite");
  $('#modal_annonce_defaite').modal('open');
}

function toast(pdvJoueur,bouclierJoueur,bouclierAdversaire,poudre){

  var pdvPerdu = (pdvJoueurPrec+bouclierJoueurPrec) - (pdvJoueur+bouclierJoueur);

  if(poudreJoueurPrec < poudre){
    Materialize.toast('+'+(poudre-poudreJoueurPrec)+'poudre',1000);
  }

  if(bouclierJoueurPrec < bouclierJoueur){
    var $toastContent = $('<span class=\"white-text\">+'+(-pdvPerdu)+'</span>');
    Materialize.toast($toastContent,1000,'purple');
  }
  else{
    if(pdvPerdu == 0){

    }
    else if(pdvPerdu < 0){
      /* on a gagne des pdv */
      var $toastContent = $('<span class=\"white-text\">+'+(-pdvPerdu)+'</span>');
      Materialize.toast($toastContent,1000,'green');
    }
    else {
      var $toastContent = $('<span class=\"white-text\">-'+pdvPerdu+'</span>');
      Materialize.toast($toastContent,1000,'red');
    }
  }
  pdvJoueurPrec = pdvJoueur;
  bouclierJoueurPrec = bouclierJoueur;
  poudreJoueurPrec = poudre;

}


socket.on('matchStart', function (obj) {

  $('#loader').hide();
  $('#zone').show();

  etatJoueur = obj.etatJoueur;
  actifAdversaire = obj.actifAdversaire;

  poudreJoueurPrec = etatJoueur.poudre;

  console.log(obj.actifAdversaire);
  console.log(obj.etatJoueur);
  console.log(obj.message);

  dessineMain(etatJoueur.main);
  dessineBarreDeVie(etatJoueur,0);
});

socket.on('FIN_DU_GAME', function(obj){
  if(obj.vainqueur == Joueur){
    annoncerVictoire();
  }
  else {
    annoncerDefaite();
  }
});

socket.on('update',function (obj) {


  etatJoueur = obj.etatJoueur;
  actifAdversaire = obj.actifAdversaire;
  carteJoue = obj.carteJoue;

  toast(obj.etatJoueur.pdv,obj.etatJoueur.bouclier,obj.bouclierAdversaire,obj.etatJoueur.poudre);

  dessineMain(etatJoueur.main);
  dessineBarreDeVie(etatJoueur,obj.bouclierAdversaire);
  dessineCartesActives(etatJoueur,actifAdversaire);

  console.log("update !");
  dessineCarteCentre(carteJoue);
  $('#zone_deck_infos_bottom_overlay').text(obj.etatJoueur.poudre);
});


socket.on("CLOCK_UPDATE", function(obj){
   $("#zone_barre_timer_time").text("00:" + obj);
   //$("#zone_barre_timer_idjoueur").text();
});


function passe_tour(){
  socket.emit('PASSE_TOUR', Joueur);
}

socket.on("FIN_TOUR", function(obj){
   modalSelectionHide();
   $("#zone_barre_timer_idjoueur").text(obj.joueurTour);
   $('#zone_deck_infos_bottom_overlay').text(obj.etatJoueur.poudre);
   dessineMain(obj.etatJoueur.main);
   dessineCartesActives(obj.etatJoueur,obj.actifAdversaire);
   //$("#zone_barre_timer_idjoueur").text();
});
