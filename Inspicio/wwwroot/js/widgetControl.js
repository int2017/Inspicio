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
var upScaling = $(document).on("click", "#close-side", function () {
    upScaling = new Boolean();

    if ($(".flex-sidebar").hasClass("side-hide")) {
        $(".view-container").removeClass("wide");
        $(".flex-sidebar").removeClass("side-hide");
        upScaling = false;
        
    }
    else {

        $("#comment-section").css("display", "none");
        $(".sidebar-menu").css("display", "");
        $(".flex-sidebar").addClass("side-hide");
        $(".view-container").addClass("wide");
        upScaling = true;
     }
    return upScaling;
});

var scalingFactor = $(".view-container").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
    if ($(".flex-sidebar").hasClass("side-hide")) {
        $("#comment-section").css("display", "none");
        $("#comment-date").css("display", "none");
    }
    else {
        $("#comment-section").css("display", "");
        $("#comment-date").css("display", "");
    }

    var originalWidth = $("#imageMap").width();
    var imagemapping = $("#imageMap");
    var screencontent = $("#screenContent");

    imagemapping.width(screencontent.width());
    var newWidth = $("#imageMap").width();
    imagemapping.height(screencontent.height());

    scalingFactor = 1;

    // If image will be increased in size (sidebar hidden)
    if (upScaling == true) {
        scalingFactor = 1 / (originalWidth / newWidth);
    }

    else if (upScaling == false) {
        scalingFactor = originalWidth / newWidth;
    }
    return scalingFactor;
});