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

//Controlling the sidebar
$(document).on("click", "#close-side", function () {

    if ($(".flex-sidebar").hasClass("side-hide")) {

        $(".view-container").removeClass("wide");
        $(".flex-sidebar").removeClass("side-hide");
    }
    else {

        $("#comment-section").css("display", "none");
        $(".sidebar-menu").css("display", "");
        $(".flex-sidebar").addClass("side-hide");
        $(".view-container").addClass("wide");
    }
});

$(".view-container").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
    if ($(".flex-sidebar").hasClass("side-hide")) {
        $("#comment-section").css("display", "none");
        $("#comment-date").css("display", "none");
    }
    else {
        $("#comment-section").css("display", "");
        $("#comment-date").css("display", "");
    }
});