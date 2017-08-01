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

        $(".flex-sidebar").removeClass("side-hide");
        $(".view-container").removeClass("wide");

    }
    else {

        $(".flex-sidebar").addClass("side-hide");
        $(".view-container").addClass("wide");
    }


});
//Controlling reviewers box
$(document).on("click", ".show-reviewers",function () {
    if ($(".reviewer-row").is(":visible")){
        $(".reviewer-row").slideUp();
        $(".show-reviewers i").css("transform", "rotate(0deg)");
    }
    else {
        $(".reviewer-row").slideDown();
        $(".show-reviewers i").css("transform", "rotate(180deg)");
    }
});

//Controlling project info tab
$(document).on("click", ".show-project", function () {
    $("#view-project-info > container").slideUp();
    if ($(".project-container").is(":visible")){
        $(".project-container").slideUp();
        $("#view-project-info i").css("transform", "rotate(0deg)");
    }
    else {
        $(".project-container").slideDown();
        $("#view-project-info i").css("transform", "rotate(180deg)");
    }
})

$(window).on("scroll", function () {
    var top = $('#view-project-info').offset().top - $(window).scrollTop()+68
    if (top <= 71) {
        $(".flex-sidebar").css("top", 71+ "px");
        
    }
    else {
        
        $(".flex-sidebar").css("top",  top + "px");
    }
})

