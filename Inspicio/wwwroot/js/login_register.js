//Controlling register/login switch
function loginswitch() {
    var w = document.getElementById('loginformmain'); 
    $(w).hide();
    var x = document.getElementById('registerform');
    $(x).show();
}

function registerswitch() {
    var y = document.getElementById('loginformmain');
    y.style.display = 'block';

    var z = document.getElementById('registerform');
    z.style.display = 'none';
}

//Change the login and register buttons when hovered over
function loginswitchhover(x) {
    x.style.backgroundColor = 'lightgrey';
}

function loginswitchout(x) {
    x.style.backgroundColor = 'white';
}

function registerhover(x) {
    x.style.backgroundColor = "grey";
}

function registerout(x) {
    x.style.backgroundColor = "#404040";
}
//$("#registersection").click(function () {
    //$(".loginsection").hide();
    //document.getElementById(loginsection).style.visibility = "hidden";
//});