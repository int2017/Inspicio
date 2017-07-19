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
});


//Controlling reviewers box
$(".show-reviewers").click(function () {
    if ($(".reviewer-row").is(":visible")){
        $(".reviewer-row").slideUp();
        $(".show-reviewers i").css("transform", "rotate(0deg)");
    }
    else {
        $(".reviewer-row").slideDown();
        $(".show-reviewers i").css("transform", "rotate(180deg)");
    }
    });

