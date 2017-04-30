
var deck_actif = 1;
var carte_deck = -1;
var carte_inventaire = -1;
var socket = io("http://localhost:3000");

//ajout css
$(document).ready(function(){


  var height = $('#deck1').height();
  $('#decks').css({'height': height+'px'});

  $('.carte-inventaire').on('click', selectionne_carte_inventaire);
  $('.carte-deck').on('click', selectionne_carte_deck);

  $('.carte-deck').on('webkitAnimationEnd oanimationend msAnimationEnd animationend',
      function(e) {
      $('.carte-deck').removeClass('carte-deck');
  });

  $('.carte-inventaire-pop').on('webkitAnimationEnd oanimationend msAnimationEnd animationend',
      function(e) {
      $('.carte-inventaire-pop').removeClass('carte-inventaire-pop');
  });

  deck_actif = 1;
});

function switcher(deck){
  if(deck == 2){
    $('#deck2').removeClass('deck2-out');
    $('#deck1').removeClass('deck1-in');
    $('#deck1').addClass('deck1-out');
    $('#deck2').addClass('deck2-in');
    $('#inventaire2').show();
    $('#inventaire1').hide();
    $('.carte-inventaire').addClass('carte-inventaire-pop');
    socket.emit('SWAP_DECK', {'actif': $('#pseudo').attr('class')+"2", 'disable': $('#pseudo').attr('class')+"1"});
    deck_actif = 2;
  }
  if(deck == 1){
    $('#deck1').removeClass('deck1-out');
    $('#deck2').removeClass('deck2-in');
    $('#deck2').addClass('deck2-out');
    $('#deck1').addClass('deck1-in');
    $('#inventaire1').show();
    $('#inventaire2').hide();
    $('.carte-inventaire').addClass('carte-inventaire-pop');
    socket.emit('SWAP_DECK', {'actif': $('#pseudo').attr('class')+"1", 'disable': $('#pseudo').attr('class')+"2"});

    deck_actif = 1;
  }
  carte_deck = -1;
  carte_inventaire = -1;
}

function selectionne_carte_deck(value) {
  carte_deck = $(this).attr('id');
  if(carte_inventaire != -1){
    /* on echange les deux cartes */

    var CD = $('#'+carte_deck);
    var CI = $('#'+carte_inventaire);
    var tmp = {'id': CD.attr('id'), 'src': CD.attr('src')};

    CD.attr('id',CI.attr('id'));
    CD.attr('src',CI.attr('src'));

    CI.attr('id',tmp.id);
    CI.attr('src',tmp.src);

    var id_carte_deck = carte_deck.split('');
    id_carte_deck.splice(0,1);
    id_carte_deck = id_carte_deck.join('');
    var id_carte_inventaire = carte_inventaire.split('');
    id_carte_inventaire.splice(0,1);
    id_carte_inventaire = id_carte_inventaire.join('');


    socket.emit('SWAP_CARD',{'deck':  $('#pseudo').attr('class')+""+deck_actif, 'carte_deck': id_carte_deck, 'carte_inventaire': id_carte_inventaire});

    carte_deck = -1;
    carte_inventaire = -1;

  }
}

function selectionne_carte_inventaire(){
  carte_inventaire = $(this).attr('id');


  if(carte_deck != -1){
    /* on echange les deux cartes */

    var CD = $('#'+carte_deck);
    var CI = $('#'+carte_inventaire);
    var tmp = {'id': CD.attr('id'), 'src': CD.attr('src')};

    CD.attr('id',CI.attr('id'));
    CD.attr('src',CI.attr('src'));

    CI.attr('id',tmp.id);
    CI.attr('src',tmp.src);

    var id_carte_deck = carte_deck.split('');
    id_carte_deck.splice(0,1);
    id_carte_deck = id_carte_deck.join('');
    var id_carte_inventaire = carte_inventaire.split('');
    id_carte_inventaire.splice(0,1);
    id_carte_inventaire = id_carte_inventaire.join('');


    socket.emit('SWAP_CARD',{'deck':  $('#pseudo').attr('class')+""+deck_actif, 'carte_deck': id_carte_deck, 'carte_inventaire': id_carte_inventaire});


    carte_deck = -1;
    carte_inventaire = -1;

  }
}
