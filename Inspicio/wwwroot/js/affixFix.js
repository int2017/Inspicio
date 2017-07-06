function checkAffix(){
    if ($(".img-wrapper").first().innerHeight() < $("#comment-section").height())
        $(".img-wrapper").affix({
            offset : {top:120,bottom:133}
        })
}