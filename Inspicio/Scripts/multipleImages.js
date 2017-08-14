﻿var dropzone = require("./createDropzone.js")

//Thumbnail class
function thumbnailClass(title, content,id,deleteScreen) {

    var self = this;

    this.id = id;
    this.title = title;
    this.content = content;

    //Creating element vars
    this.overviewContainer = $(document.createElement('div')).addClass("col-xs-4 col-md-4").attr('id', "image-rev-" + this.id);
    this.deleteScreen = deleteScreen;
    this.innerContainer = $(document.createElement('div')).addClass("col-xs-12 col-md-12 thumbnail-inner "+this.id).appendTo(this.overviewContainer).prop("title", this.title);
    this.img = $(document.createElement('img')).attr('src', this.content).appendTo(self.innerContainer);
    this.outerContainer = $(document.createElement("div")).addClass("col-xs-4 col-md-3").attr("id", "image-" + this.id).append($(this.innerContainer).clone().append(this.deleteScreen));

    //Adding thumbnails in the thumbnail
    this.init = function () {
        $(self.outerContainer).appendTo("#thumbnail-container");
        $(self.overviewContainer).appendTo("#review-thumbnail-container");
    }
    this.init();

    this.remove = function () {
        $(self.outerContainer).remove();
        $(self.overviewContainer).remove();
    }
}

//Screen class
function screenClass(id,title,description,content) {

    var self = this;

    //ID to identify the place in projectScreens array
    this.id = id;

    //Variables required for a screen
    this.screenContent=content;
    this.screenTitle=title;
    this.screenDescription = description;
    this.deleteScreen = $(document.createElement('a')).addClass("delete-screen").html("<i class='fa fa-trash-o' aria-hidden='true'></i>");

    //Creating a thumbnail
    this.thumbnail = new thumbnailClass(this.screenTitle, this.screenContent, this.id, this.deleteScreen);

    //Deleting screen and setting it's id to -1, in the end only screens with ids>-1 will be added into the final list
    this.remove = function () {
        self.thumbnail.remove();
        self.id = -1;
    }
    this.updateScreen = function (title, description) {
        self.screenTitle = title;
        self.screenDescription = description;
        $(".thumbnail-inner." + self.thumbnail.id).prop("title", title);
    }
}

//Review class
function reviewClass() {

    //Addition variable to be used in functions
    var self = this;

    //Creating the variables needed for a review;
    this.projectTitle;
    this.projectDescription;
    this.projectThumbnail;
    this.projectScreens = [];

    //Buttons for controlling sections and screens
    this.addScreenButton = $("#add-img");
    this.saveChangesButton = $("#edit-img");

    this.resetButton = $("#reset").click(function () {
        self.clearScreenFields();
    });

    //Variables for controlling the fields
    this.screenTitleField = $("#Image_Title");
    this.screenDescriptionField = $("#Image_Description_UserInput");
    this.screenDropzone = dropzone.createDropzone("screenDropzone", this.addScreenButton, this.screenTitleField);
    this.thumbnailDropzone = dropzone.createDropzone("projectThumbnailDropzone");
    
    this.projectTitleField = $("#project-title").on("blur", function () {
        self.projectTitle = this.value;
    });
    this.projectDescriptionField = $("#project-description").on("blur", function () {
        self.projectDescription = this.value;
    });
   
    this.clearScreenFields = function () {
        $(self.screenDescriptionField).off();
        $(self.screenTitleField).off();
        self.screenDropzone.clearDropzone();
        this.screenTitleField.val("");
        this.screenDescriptionField.val("");
    }

    $(this.addScreenButton).click(function () {
        if ($(this).hasClass("ready")) {
            $(self.screenTitleField).off();
            $(self.screenDescriptionField).off();
            var newScreen = new screenClass(self.projectScreens.length, $(self.screenTitleField).val(), $(self.screenDescriptionField).val(), $(self.screenDropzone.b64input).val());
            self.projectScreens.push(newScreen);
            self.clearScreenFields();
            self.addThumbnailListeners(newScreen);
            newScreen.deleteScreen.click(function () {
                newScreen.remove();
                if (self.currentScreen === newScreen.id) {
                    self.clearScreenFields();
                }
            })
        }

    })

    //Function to change the values of fields 
    this.changeValues = function (screen) {
        $(self.addScreenButton).removeClass("ready");
        $(self.screenTitleField).val(screen.screenTitle);
        $(self.screenDescriptionField).val(screen.screenDescription);
        self.screenDropzone.addFile(screen.screenContent, screen.screenTitle);
        
    }

    //Adding listeners to the thumbnail of a screen. Had to be put here because access to the fields is neccessary.
    this.addThumbnailListeners = function (screen) {
       
        $(self.saveChangesButton).off();
        $(".thumbnail-inner." + screen.id).on("click", function () {
            $(".screen").click();
            self.currentScreen = screen.id;
            $(self.screenTitleField).unbind("keydown");
            $(self.screenDescriptionField).unbind("keydown");
            self.changeValues(screen);
            $(self.screenTitleField).on("change", function () {
                self.fieldListeners(screen)
            })
            $(self.screenDescriptionField).on("change", function () {
                self.fieldListeners(screen)
            })
        })
    }
    this.fieldListeners = function (screen) {
       if ($(self.saveChangesButton).slideDown().is(":hidden") && (!screen.screenDescription.equals($(self.screenDescriptionField).val()) || !screen.screenTitle.equals($(self.screenTitleField).val()))) {
            $(self.saveChangesButton).slideDown();
        }
       $(self.saveChangesButton).click(function () {
           self.projectScreens[screen.id].updateScreen($(self.screenTitleField).val(), $(self.screenDescriptionField).val());
            $(self.saveChangesButton).slideUp();
            $(this).unbind("click");
            self.clearScreenFields();
        })
       
    }

    //Submit review function
    this.submit = function () {

        //Removing deleted screens
        var finalScreenList =[];
        $(self.projectScreens).each(function () {
            if (this.id > -1) {
                var finalScreen = {
                    Title: this.screenTitle,
                    Description: convertToHTML(this.screenDescription),
                    Content: this.screenContent
                }
                finalScreenList.push(finalScreen);
            }
        })
        //Adding all selected reviewers to the list
        var reviewers =[];
        $(".reviewer-info input[type='checkbox']").each(function (index) {
            if ($(this).is(":checked")) {

                var userId = $("#Reviewers_" + index + "__Id").val();
                var profileName = $("#profilename-" + index + " label").html();
                var email = $("#email-" + index + " label").html();
                var user = {
                    "Id": userId,
                    "ProfileName": profileName,
                    "Email": email
                };
                reviewers.push(user);
            }

        })
        var CreatePageModel = {
            Screens: finalScreenList,
            Reviewers: reviewers,
            ReviewTitle: self.projectTitle,
            ReviewDescription: convertToHTML(self.projectDescription),
            ReviewThumbnail: $("#b64projectThumbnailDropzone").val()
        }
        var data = {
            __RequestVerificationToken: $('[name= "__RequestVerificationToken"]').val(),
            CreatePageModel: CreatePageModel
        }
        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: location.pathname, // Controller  
                data: data,
                success: function (url) {
                    window.location.href = url;
                }
            });
    }
}

$(document).ready(function () {
    var review = new reviewClass();
    $(document).on("click", ".create-a", function () {
        if (review.projectTitle !== undefined && review.projectTitle !== undefined && review.projectTitle.value !== "") {
            $("#review-title-header").html(review.projectTitle);
            $("#reviewer-project-title").html(review.projectTitle);
        }
        if (review.projectDescription !== undefined && review.projectDescription !== undefined && review.projectDescription.value !== "") {
            $("#reviewer-project-description").html(review.projectDescription);
        }
    })
    $(document).on("click", ".screen", function () {
        $(".create-a").removeClass("active");
        $(".create-a.screen").addClass("active");
        $("#project-info").fadeOut(300);
        $(".add-reviewers-overlay").fadeOut(300);
        $(".image-upload-container").delay(250).fadeIn(300);
    })
    $(document).on("click", ".project", function () {
        $(".create-a").removeClass("active");
        $(".create-a.project").addClass("active");
        $(".add-reviewers-overlay").fadeOut(250);
        $(".image-upload-container").hide();
        $("#project-info").delay(250).fadeIn(250);
    });
    $(document).on("click", ".overview", function () {
        $(".create-a").removeClass("active");
        $(".create-a.overview").addClass("active");
        $(".add-reviewers-overlay").delay(250).fadeIn(300);
    })
    $(".add-reviewers-overlay").click(function (event) {
        if (event.defaultPrevented) return;
        if (!$(event.target).closest('.panel.panel-default').length) {
            $(this).fadeOut(200);
            $(".create-a").removeClass("active");
            if ($(".image-upload-container").is(":visible")) {
                $(".create-a.screen").addClass("active");
            }
            else {
                $(".create-a.project").addClass("active");
            }
        }
    })
    $(document).on("click", "#submit-images", function () {
        review.submit();
    })

})