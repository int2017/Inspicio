$(document).ready(function () {
    //Creating the list of images and users to be passed into the controller
    var listOfImages = [];
    var listOfUsers = [];
    //Creates an Image object that is added to the list of Images
    $("#add-img").click(function () {
        
        var title = $("#Image_Title").val();
        var description = $("#Image_Description_UserInput").val();
        var content = $("#b64").val();
        var contentCol = listOfImages.map(v => v.Content);
        if ($.inArray(content, contentCol) > -1) {
            alert("This image is already added");
            myDropzone.removeAllFiles();
            $(".dropzone").html("");
        }
        else {
            var image = {
                "Title": title,
                "Description": description,
                "Content": content
            };
            listOfImages.push(image);
            
            $("#Image_Title").val("");
            $("#Image_Description_UserInput").val("");
            $("#b64").val("");
            myDropzone.removeAllFiles();
            $(".dropzone").html("");
            appendThumbnail(listOfImages.length - 1, content);
        }
        //Clear the fields for another image
        
    })
    var currentImage;
    function appendThumbnail(index, image) {
        
        var container = $(document.createElement('div')).addClass("col-xs-4 col-md-2").attr('id', "image-" + index);
        var innerContainer = $(document.createElement('div')).addClass("col-xs-12 col-md-12 thumbnail-inner");
        var image = $(document.createElement('img')).addClass('img-responsive').attr('src', image);
        $(innerContainer).click(function () {
            currentImage = index;
            $(".dropzone").html("");
            $("#Image_Title").val(listOfImages[index].Title);
            $("#Image_Description_UserInput").val(listOfImages[index].Description);
            $("#b64").val(listOfImages[index].Content);
            var image = $(document.createElement("img")).addClass("img-responsive").attr('src', listOfImages[index].Content);
            var myImage = {
                name: listOfImages[index].Title
            }
            $("#Image_Title").change(function () {
                currentImage = index;
                $("#edit-img").show();
            })
            $("#Image_Description_UserInput").change(function () {
                currentImage = index;
                $("#edit-img").show();
            })
            myDropzone.emit("addedfile", myImage);
            myDropzone.emit("thumbnail", myImage, listOfImages[index].Content);
        })
        $(image).appendTo(innerContainer);
        $(innerContainer).appendTo(container);
        $(container).appendTo("#thumbnail-container");
    }

    $("#edit-img").click(function () {
        listOfImages[currentImage].Title = $("#Image_Title").val();
        listOfImages[currentImage].Description = $("#Image_Description_UserInput").val();
        $("#Image_Title").off();
        $("#Image_Description_UserInput").off();
        $(this).hide();
    })
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