var pts = 0;

$(document).ready(function(){
    console.log("Document pret");

    setZoneSize();

    $('#zone_jeu_cards_middle').on('click',modalSelectionHide);
    $('#zone_jeu_cards_player').on('click',modalSelectionHide);
    $('#zone_jeu_cards_adversaire').on('click',modalSelectionHide);


    console.log("ScreenW: " + ScreenW);
    console.log("ScreenH: " + ScreenH);

    console.log("ZoneW: " + ZoneW);
    console.log("ZoneH: " + ZoneH);

    setZoneObjects();
    $("#zone_select_card_effect").hide();

    // $('.modal').modal({
    //   dismissible: false, // Modal can be dismissed by clicking outside of the modal
    //   opacity: .5, // Opacity of modal background
    //   inDuration: 300, // Transition in duration
    //   outDuration: 200, // Transition out duration
    //   startingTop: '4%', // Starting top style attribute
    //   endingTop: '10%', // Ending top style attribute
    // });
    //
    // $('#modal_connexion').modal('open');






   socket.on("AUTH_CLI_OK", function(obj){
            var $toastContent = $('<span color="red">OK CONNECTE</span>');
            Materialize.toast($toastContent, 6000);
            Joueur = $('#pseudo').attr('class')
            // $('#modal_connexion').modal('close');
    } );

    socket.on("AUTH_CLI_FAIL", function(obj){
            var $toastContent = $('<span color="red">Erreur, mauvais pseudo et/ou mot de passe !</span>');
            Materialize.toast($toastContent, 6000);
            $("#connexion_pseudo").val("");
            $("#connexion_mdp").val("");

    } );


    $('#zone').hide();

    var auth = { 'pseudo': $("#pseudo").attr('class'), 'mdp': $("#mdp").attr('class')};
    socket.emit("AUTH_CLI", auth);

    setInterval(pt_clignote,1000);

  });


  function pt_clignote(){
    pts = (pts+1)%4
    if(pts == 0) $('#attente').text('En attente d\'un adversaire');
    if(pts == 1) $('#attente').text('En attente d\'un adversaire.');
    if(pts == 2) $('#attente').text('En attente d\'un adversaire..');
    if(pts == 3) $('#attente').text('En attente d\'un adversaire...');
  }
