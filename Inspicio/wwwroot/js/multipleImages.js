﻿$(document).ready(function () {
    var dropzoneText = $(".dz-message.needsclick");
    //Creating the list of images and users to be passed into the controller
    var listOfImages = [];
    var listOfUsers = [];
    var listOfDeleted = [];
    //Creates an Image object that is added to the list of Images
    $(document).on("click", "#add-img",function () {
        var title = $("#Image_Title").val();
        var description = $("#Image_Description_UserInput").val();
        var content = $("#b64").val();
        if (title.length !== 0 &&  content.length !== 0) {
        $(".dropzone").css("width", "100%");
        $(this).removeClass("ready");
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
            
            $("#Image_Title").val("").html("");
            $("#Image_Description_UserInput").val("");
            $("#b64").val("");
            myDropzone.removeAllFiles();
            $(".dropzone").html("").append(dropzoneText);
            appendThumbnail(listOfImages.length - 1, content);
        }
        
        }
        else {
            alert("You must add a screen and a title!")
        }
    })
    $("#create-screens").click(function () {
        $("#project-info").hide();
        $(".image-upload-container").show();
    })
    function appendThumbnail(index, image) {
        
        var containerMain = $(document.createElement('div')).addClass("col-xs-4 col-md-2").attr('id', "image-" + index);
        var containerReview = $(document.createElement('div')).addClass("col-xs-3 col-md-3").attr('id', "image-rev-" + index);
        var deleteReview = $(document.createElement('a')).addClass("delete-screen").html("<i class='fa fa-trash-o' aria-hidden='true'></i>");  
        var image = $(document.createElement('img')).attr('src', image);
        var innerContainer = $(document.createElement('div')).addClass("col-xs-12 col-md-12 thumbnail-inner");
        $(image).appendTo(innerContainer);
        $(innerContainer).appendTo(containerReview);
        var mainInnerContainer = $(innerContainer).clone().append(deleteReview).appendTo(containerMain);
        $(containerMain).appendTo("#thumbnail-container");
        $(containerReview).appendTo("#review-thumbnail-container");
        $(mainInnerContainer).click(function () {
            alert("lol");
            $("#edit-img").hide();
            $(".dropzone").html("").append(dropzoneText);
            $("#Image_Title").html("").val(listOfImages[index].Title);
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

        $(deleteReview).click(function (e) {
            e.stopPropagation();
            $(listOfDeleted).push(index);
            $("#image-" + index).detach();
            $("#image-rev-" + index).detach();
        })
    }
    
    $("#edit-img").click(function () {
        listOfImages[currentImage].Title = $("#Image_Title").val();
        listOfImages[currentImage].Description = $("#Image_Description_UserInput").val();
        $("#Image_Title").off();
        $("#Image_Description_UserInput").off();
        $(this).hide();
    })
    $("#create-reviewer").click(function () {
        $(".add-reviewers-overlay").css("display","flex").hide().fadeIn(400);
    })
    $(".add-reviewers-overlay > div").click(function (e) {
        e.stopPropagation();
    })
    $(".add-reviewers-overlay").click(function () {
        $(this).fadeOut(200);
    })
    $("#submit-images").click(function () {
        $(listOfDeleted).each(function () {
            listOfImages()
        })
        //Get the details of the users who were checked as reviewers NEEDS TO BE UPDATED
        $(".reviewer-info input[type='checkbox']").each(function (index) {
            if ($(this).is(":checked")) {
                var element = $(this).attr("name").split(".")[0];
                var userId = $(document.getElementsByName(element + ".Id")).val();
                var profileName = $("#profilename-" + index + " label").html();
                var email = $("#email-" + index +" label").html();
                var user = {
                    "UserId": userId,
                    "ProfileName": profileName,
                    "Email": email
                };
                listOfUsers.push(user);
            }
            
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