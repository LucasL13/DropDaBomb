$(document).ready(function(){
    console.log("Ready");


    $('ul.tabs').tabs({});


    $("#tab-step-1").trigger("mouseenter");


    setTimeout(() => {
        next_step();
    }, 2000);

     setTimeout(() => {
        next_step();
    }, 8000);
});