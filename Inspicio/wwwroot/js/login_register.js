//Controlling register/login switch
$(document).ready(function () {
    $("#registersection").click(function () {
        var w = document.getElementById('loginformmain');
        $(w).hide();
        var x = document.getElementById('registerform');
        $(x).show();
    })

    $("#loginsection").click(function () {
        var z = document.getElementById('registerform');
        $(z).hide();
        var y = document.getElementById('loginformmain');
        $(y).show();
       
    })


})



