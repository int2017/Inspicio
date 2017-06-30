function dropzoneBackground() {
    var location = $(".dz-image > img").attr("src");
    $(".dropzone").css("background-image","url("+location+")")
}