

$("#close-side").click(function () {
    
    if ($(".flex-sidebar").hasClass("side-hide")) {
        
        $(".flex-sidebar").removeClass("side-hide");
        $(".view-container").removeClass("wide");
        
    }
    else {
        
        $(".flex-sidebar").addClass("side-hide");
        $(".view-container").addClass("wide"); 
    }
  
    
});

$(document).ready(function () {
    $("#imageMap").width($("#image-container img").width());
    $("#imageMap").height($("#image-container img").height());
})