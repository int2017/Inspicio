$(document).ready(function () {
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
        }
    })

    $(document).on("click", "#create-quick-review", function () {
        var title = $("#Quick_Image_Title").val();
        var description = $("#Quick_Image_Description_UserInput").val();
        var content = $("#b64quickUploader").val();
        var listOfUsers = [];
        var listOfImages = [];
        $(".quick-create-overlay .reviewer-info input[type='checkbox']").each(function (index) {
            if ($(this).is(":checked")) {
                var userId = $("#Reviewers_" + index + "__Id").val();
                var profileName = $("#profilename-" + index + " label").html();
                var email = $("#email-" + index + " label").html();
                var user = {
                    "Id": userId,
                    "ProfileName": profileName,
                    "Email": email
                };
                listOfUsers.push(user);
            }
        })
        var image = {
            "Title": title,
            "Description": description,
            "Content": content
        };
        listOfImages.push(image);
        var CreatePageModel = {
            Screens: listOfImages,
            Reviewers: listOfUsers,
            ReviewTitle: null,
            ReviewDescription: null,
            ReviewThumbnail: null
        }
        var data = {
            __RequestVerificationToken: $('[name= "__RequestVerificationToken"]').val(),
            CreatePageModel: CreatePageModel
        }
        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "/Images/Create", // Controller  
                data: data,
                success: function (url) {
                    window.location.href = url;
                }
            });
    })
})

