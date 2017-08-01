$(document).ready(function () {
    var dropzoneMainText = $("#uploader .dz-message.needsclick");
    //Creating the list of images and users to be passed into the controller
    var listOfImages = [];
    var listOfUsers = [];
    var listOfDeleted = []; 
    //Creates an Image object that is added to the list of Images
    $(document).on("click", "#add-img", function () {
        var title = $("#Image_Title").val();
        var description = $("#Image_Description_UserInput").val();
        var content = $("#b64uploader").val();
        if (title.length !== 0 &&  content.length !== 0) {
            $("#uploader").css("width", "100%");
            $(this).removeClass("ready");
            var contentCol = listOfImages.map(v => v.Content);
            if ($.inArray(content, contentCol) > -1) {
             alert("This image is already added");
             myDropzone.removeAllFiles();
             $("#uploader").html("").append(dropzoneMainText);
             $(dropzoneMainText).show();
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
            $("#b64uploader").val("");
            myDropzone.removeAllFiles();
            $("#uploader").html("").append(dropzoneMainText);
            $(dropzoneMainText).show();
            appendThumbnail(listOfImages.length - 1, content);
        }
        
        }
        else {
            alert("You must add a screen and a title!")
        }
    })
    $("#create-screens").click(function () {
        if ($("#project-title").val() === "") {
            alert("Add a project title first!")
        }
        else{
            $(this).attr("id", "create-screens");
            $("#project-info").fadeOut(300);
            $("#review-title-header").fadeOut(300);
            setTimeout(function () {
                $("#reviewer-project-title").html($("#project-title").val());
                $("#reviewer-project-description").html($("#project-description").val());
                $("#review-title-header").html($("#project-title").val());
            }, 200)
            
            $("#review-title-header").fadeIn(300);
            $(".main-edit").delay(300).fadeIn(300);
            $(".image-upload-container").delay(300).fadeIn(300);
            
        }
    })
    function appendThumbnail(index, content) {
        
        var containerMain = $(document.createElement('div')).addClass("col-xs-4 col-md-2").attr('id', "image-" + index);
        var containerReview = $(document.createElement('div')).addClass("col-xs-3 col-md-3").attr('id', "image-rev-" + index);
        var deleteScreen = $(document.createElement('a')).addClass("delete-screen").html("<i class='fa fa-trash-o' aria-hidden='true'></i>");  
        var image = $(document.createElement('img')).attr('src', content);
        var innerContainer = $(document.createElement('div')).addClass("col-xs-12 col-md-12 thumbnail-inner");
        $(image).appendTo(innerContainer);
        $(innerContainer).appendTo(containerReview);
        var mainInnerContainer = $(innerContainer).clone().append(deleteScreen).appendTo(containerMain);
        $(containerMain).appendTo("#thumbnail-container");
        $(containerReview).appendTo("#review-thumbnail-container");
        $(mainInnerContainer).click(function () {
            if (!$(event.target).closest('.delete-screen').length) {
                $("#add-img").removeClass("ready");
                $("#edit-img").slideUp();
                $("#uploader").html("");
                $("#Image_Title").html("").val(listOfImages[index].Title);
                $("#Image_Description_UserInput").val(listOfImages[index].Description);
                $("#b64uploader").val(listOfImages[index].Content);
                var image = $(document.createElement("img")).addClass("img-responsive").attr('src', listOfImages[index].Content);
                var myImage = {
                    name: listOfImages[index].Title
                }
                $("#Image_Title").change(function () {
                    currentImage = index;
                    $("#edit-img").slideDown();
                })
                $("#Image_Description_UserInput").change(function () {
                    currentImage = index;
                    $("#edit-img").slideDown();
                })
                myDropzone.emit("addedfile", myImage);
                myDropzone.emit("thumbnail", myImage, listOfImages[index].Content);
                $("#add-img").removeClass("ready");
            }
           
        })

        $(deleteScreen).click(function (e) {
            if (listOfImages[index].Content === $("#b64uploader").val()) {
                $("#add-img").addClass("ready");
            }
            listOfImages[index].Content = "";
            $("#image-" + index).detach();
            $("#image-rev-" + index).detach();
        })
    }
    
    $("#edit-img").click(function () {
        listOfImages[currentImage].Title = $("#Image_Title").val();
        listOfImages[currentImage].Description = $("#Image_Description_UserInput").val();
        $("#Image_Title").off();
        $("#Image_Description_UserInput").off();
        $(this).slideUp();
    })
    $("#create-reviewer").click(function () {
        if ($("#b64uploader").val() !== "") {
            var contentCol = listOfImages.map(v => v.Content);
            if ($.inArray($("#b64uploader").val(), contentCol) > -1) {
                myDropzone.removeAllFiles();
                $("#uploader").html(dropzoneMainText).css("width", "100%");
                $("#Image_Title").val("");
                $("#Image_Description_UserInput").val("");
                $("#add-img").removeClass("ready");
            }
            else {
                if ($("#Image_Title").val().length === 0) {
                    $("#Image_Title").val("Screen " + listOfImages.length + 1);
                    

                }
                $("#add-img").click();
            }
            
        }
        
        $(".add-reviewers-overlay").css("display", "flex").hide().fadeIn(400);
    })
    //Subtitution for .stopPropogation() 
    $(".add-reviewers-overlay").click(function (event) {
        if (event.defaultPrevented) return;
        if (!$(event.target).closest('.panel.panel-default').length) {
            $(this).fadeOut(200);
        }
    })
    $("#submit-images").click(function () {
        $(this).prop("disabled", true);
        var finalScreenList = [];
        $(listOfImages).each(function (index) {
            if (this.Content !== "") {
                finalScreenList.push(this);
            }
        })
        
        //Get the details of the users who were checked as reviewers NEEDS TO BE UPDATED
        $(".reviewer-info input[type='checkbox']").each(function (index) {
            if ($(this).is(":checked")) {
                
                var userId = $("#Reviewers_" + index + "__Id").val();
                var profileName = $("#profilename-" + index + " label").html();
                var email = $("#email-" + index +" label").html();
                var user = {
                    "Id": userId,
                    "ProfileName": profileName,
                    "Email": email
                };
                listOfUsers.push(user);
            }
            
        })
        var CreatePageModel = {
            Screens: listOfImages,
            Reviewers: listOfUsers,
            ReviewTitle: $("#project-title").val(),
            ReviewDescription: $("#project-description").val(),
            ReviewThumbnail : $("#b64uploaderThumb").val()
        }
        var data={
            __RequestVerificationToken: $('[name= "__RequestVerificationToken"]').val(),
            CreatePageModel: CreatePageModel
        }
        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "/Images/Create", // Controller  
                data: data,
                success: function () {
                    
                }
            });
    })
    
    $(document).on("click", ".edit-project", function (e) {
        $(".main-edit").fadeOut(200);
        $(".add-reviewers-overlay").fadeOut(200);
        $(".image-upload-container").fadeOut(200);
        $("#project-info").delay(200).fadeIn(200);
        
    })  
    $("#reset").click(function () {
        $("#edit-img").hide();
        myDropzone.removeAllFiles();
        $("#Image_Title").val('');
        $("#Image_Description_UserInput").val('');
        $("#add-img").removeClass("ready");
        $("#uploader").html(dropzoneMainText).animate({ width: "100%" }, 300)
    })
})