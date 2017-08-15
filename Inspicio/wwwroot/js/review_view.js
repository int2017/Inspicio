$(document).ready(function () {

    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("toggle_review_info");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
        $('body').addClass('modal-open');
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    /*add reviewees modal*/
    // Get the modal
    var modal1 = document.getElementById('add-reviewees-modal');

    // Get the button that opens the modal
    var btn1 = document.getElementById("new-reviewees-section");

    // When the user clicks on the button, open the modal 
    btn1.onclick = function () {
        modal1.style.display = "block";
        $('body').addClass('modal-open');
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal1) {
            modal1.style.display = "none";
            $('body').removeClass('modal-open');
        }
        if (event.target == modal) {
            modal.style.display = "none";
            $('body').removeClass('modal-open');
        }
    }
});