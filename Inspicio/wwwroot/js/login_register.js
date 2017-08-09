//Controlling register/login switch
$(document).ready(function () {
    $("#registersection").click(function () {
        var w = document.getElementById('loginformmain');
        $(w).hide();
        $("#loginsection").css('backgroundColor', '	#D3D3D3');
        $("#registersection").css('backgroundColor', '#000000');
        var x = document.getElementById('registerform');
        $(x).show();
    })

    $("#loginsection").click(function () {
        var z = document.getElementById('registerform');
        $(z).hide();
        $("#registersection").css('backgroundColor', '#D3D3D3');
        $("#loginsection").css('backgroundColor', '#000000');
        var y = document.getElementById('loginformmain');
        $(y).show();
       
    })


})



