$(document).ready(function () {

    $('body').addClass('modal-open');

    function encodeBase64(file, area) {
        if (file) {
            var FR = new FileReader();
            FR.addEventListener("load", function (e) {
                var images = $(".dropzone#" + area + "  img").remove();
                document.getElementById("b64" + area).value = e.target.result;
                var image = document.createElement("img");

                image.src = e.target.result;
                $(image).appendTo(".dropzone#" + area + " > .dz-preview >.dz-image");

                $(image).click(function () {
                    $(".dropzone#" + area).click();
                })
            });

            FR.readAsDataURL(file);
        }
    }

    Dropzone.autoDiscover = false;
    var quickDropzone = new Dropzone("#quickUploader", {
        maxFiles: 1,
        autoProcessQueue: false,
        init: function () {

            this.on("addedfile", function (file) {
                
                $("#quickUploader").css("width", "auto");
                encodeBase64(quickDropzone.files[0], "quickUploader");
                if ($("#Quick_Image_Title").val() == "") {

                    $("#Quick_Image_Title").val(quickDropzone.files[0].filename)
                }
            });
        },

        // Function to be called on the server
        url: "doNothing"
    });
    quickDropzone.on("maxfilesexceeded", function (file) {
        $("#quickUploader img").remove();
        quickDropzone.removeAllFiles();
        this.addFile(file);
    });
    $(".overlay").click(function (event) {
        if (event.defaultPrevented) return;
        if (!($(event.target).closest('.panel').length) && !($(event.target).closest('.dropzone').length)) {
            $(this).hide().remove();
            $('body').removeClass('modal-open');
        }
    })
    //Sending the quick review data to the DB
    $(document).on("click", "#create-quick-review", function () {
     
        //Screen object
        var ScreenList = [];
        var Screen = {
            Title: $("#Quick_Image_Title").val(),
            Description: $("#Quick_Image_Description_UserInput").val(),
            Content: $("#b64quickUploader").val(),
            ReviewId: $("#ReviewId").val()
        }
        var screenWithComments = {
            CommentList: null,
            Screen: Screen
        }
        ScreenList.push(screenWithComments);

        var CreatePageModel = {
            CommentsAndScreens: ScreenList
        }

        var data = {
            __RequestVerificationToken: $('[name= "__RequestVerificationToken"]').val(),
            CreatePageModel: CreatePageModel
        }

        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "../NewScreen", // Controller  
                data: data,
                success: function (url) {
                    window.location.reload();
                }
            });
    })
})