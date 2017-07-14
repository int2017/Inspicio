//Replying to comments
$(document).on("click", ".reply", function () {
    var which = $(this).data("target");
    $(".replied-section").slideUp();
        if (!($("#replies-" + which).is(":visible"))) {
            $("#replies-" + which).slideDown();
        
        }
        else {
            $("#replies-" + which).slideUp();
        }
})
