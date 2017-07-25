$(document).ready(function () {
    //Creating the list of images and users to be passed into the controller
    var listOfImages = [];
    var listOfUsers = [];
    //Creates an Image object that is added to the list of Images
    $("#add-img").click(function () {
        var title = $("#Image_Title").val();
        var description = $("#Image_Description_UserInput").val();
        var content = $("#b64").val();
        var image = {
            "Title": title,
            "Description": description,
            "Content": content
        };
        listOfImages.push(image);
        //Clear the fields for another image
        $("#Image_Title").val("");
        $("#Image_Description_UserInput").val("");
        $("#b64").val("");
        myDropzone.removeAllFiles();
        appendThumbnail(listOfImages.length-1, content);
    })

    function appendThumbnail(index, image) {
        
        var container = $(document.createElement('div')).addClass("col-xs-4 col-md-3").attr('id',"image-"+index);
        var image = $(document.createElement('img')).addClass('img-responsive').attr('src', image);
        $(image).click(function () {
            $(".dropzone").html("");
            $("#Image_Title").val(listOfImages[index].Title);
            $("#Image_Description_UserInput").val(listOfImages[index].Description);
            $("#b64").val(listOfImages[index].Content);
            var image = $(document.createElement("img")).addClass("img-responsive").attr('src', listOfImages[index].Content);
            myDropzone.emit(image);

        })
        $(image).appendTo(container);
        $(container).appendTo("#thumbnail-container");
    }


    $("#submit-images").click(function () {
        //Get the details of the users who were checked as reviewers
        $("#users input[type='checkbox']:checked").each(function () {
            var element = $(this).attr("name").split(".")[0];
            var userId = $(document.getElementsByName(element + ".Id")).val();
            var profileName = $(this).nextAll().eq(0).html();
            var email = $(this).nextAll().eq(1).html();
            var user = {
                "UserId": userId,
                "ProfileName": profileName,
                "Email": email
            };
            listOfUsers.push(user);
        })
        var CreatePageModel = {
            "Users": listOfUsers,
            "Images": listOfImages
            }
        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "../Create", // Controller  
                contentType: "application/json;",
                dataType: "text",
                data: JSON.stringify(CreatePageModel),
                success: function () {
                    
                }
            });
    })
})