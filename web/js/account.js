
var socket;
var step = 1;

var account;






$(document).ready(function(){

    socket = io.connect('http://localhost:3000');

    $("#btn-create").click(function(e){check_account();});

    socket.on("CREATE_ACCOUNT_CHECK_FAIL_ALREADYEXIST", function(obj){
        Materialize.toast("Un compte avec ce pseudo/email existe déjà", 4000);
    });
    socket.on("CREATE_ACCOUNT_CHECK_SUCCESS", function(obj){
        next_step();
    });

    socket.on("CREATE_ACCOUNT_SUCCESS", function(obj){
        next_step();
    });



    $('ul.tabs').tabs({});


    $("#tab-step-1").trigger("mouseenter");

    $("#btn-valider-starter").click(() => create_account());

    $("#step2-nextbtn").click(() => next_step());

    $("#btn-valider-starter").hide();


    $("#card_starter_HP").click(() => {
        setSelectedStarter("#card_starter_HP", "green");
    });

    $("#card_starter_YSNP").click(() => {
        setSelectedStarter("#card_starter_YSNP", "blue");
    });

    $("#card_starter_MTBBWY").click(() => {
        setSelectedStarter("#card_starter_MTBBWY", "red");
    });


    $("#signin_submit").click(() => connect_account());

     socket.on("CONNECT_ACCOUNT_CHECK_SUCCESS", function(obj){
        console.log("jai recu walla");
        alert("CONNEXION REUSSIE");
    });

    socket.on("CONNECT_ACCOUNT_CHECK_FAIL", function(obj){
        alert("CONNEXION ECHOUEE");
    });

});

function connect_account(){

    var account = {
        'pseudo': $("#signin_pseudo").val(),
        'password': $("#signin_password").val()
    };

    socket.emit("CONNECT_ACCOUNT_CHECK", account);
}

function check_account(){


    var pseudo      = $("#pseudo").val();
    var mdp         = $("#password").val();
    var mdp_confirm = $("#password_confirm").val();
    var email       = $("#email").val();

    /* JAMAIS DE VERIFICATION COTE CLIENT */

    // if(pseudo == "" || pseudo == " "){
    //     Materialize.toast('Pseudo invalide', 6000);         return;    }
    //
    // if(mdp == "" || mdp == " " || mdp.length < 6){
    //     Materialize.toast('Mot de passe invalide', 6000);         return;    }
    //
    // if(mdp_confirm != mdp){
    //     Materialize.toast('Les mots de passes de correspondent pas', 6000);         return;    }
    //
    // if(email == "" || email == " " || email.indexOf('@') < 1){
    //     Materialize.toast('Email invalide', 6000);         return;    }

    /* FIN */

    account = {
        'pseudo': pseudo,
        'mdp': mdp,
        'mdp_confirm': mdp_confirm,
        'email': email
    }

    console.log(account);

    socket.emit("CREATE_ACCOUNT_CHECK", account);
}


function create_account(){
    socket.emit("CREATE_ACCOUNT_SEND", account);
}


function next_step(){
    $("#tab-step-"+step).removeClass("tab-active");
    $("#tab-step-"+step).addClass("disabled");
    $("#tab-step-"+step).tooltip("remove");

    step++;
    $("#tab-step-"+step).removeClass("disabled");
    $("#tab-step-"+step).addClass("tab-active");
    $("#tab-step-"+step+"-click").trigger("click");
    $("#tab-step-"+step).trigger("mouseenter");
}

function setSelectedStarter(id, color){
        $("#btn-valider-starter").show();
        resetSelectedStarter();
        $(id).css("border", "5px solid white");
        $(id).css("border-radius", "2%");
        $(id).removeClass("transparent");
        $(id).addClass(color);

        if(id == "#card_starter_HP")
            account.starter = "HP";
        else if(id == "#card_starter_MTBBWY")
            account.starter = "MTBBWY";
        else if(id == "#card_starter_YSNP")
            account.starter = "YSNP";
}

function resetSelectedStarter(){
        $("#card_starter_HP").css("border", "none");
        $("#card_starter_HP").removeClass("green");
        $("#card_starter_HP").addClass("transparent");

        $("#card_starter_MTBBWY").css("border", "none");
        $("#card_starter_MTBBWY").removeClass("red");
        $("#card_starter_MTBBWY").addClass("transparent");

        $("#card_starter_YSNP").css("border", "none");
        $("#card_starter_YSNP").removeClass("blue");
        $("#card_starter_YSNP").addClass("transparent");
}
