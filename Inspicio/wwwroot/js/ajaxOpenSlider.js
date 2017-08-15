$(document).ready(function () {

    $(function () {

        $(document).on("click", '#screen-state-toggle', function () {

            var id = $("#ScreenId").val();
            $.ajax(
                {
                    type: "POST",
                    url: "../Toggle_ScreenState?id=" + id, 
                    dataType: "json",
                    success: function (response) {

                        if (response == 0) {
                            $('#' + id).css("opacity", "1.0");
                            $('#' + id + '.state').removeClass("screen-closed");
                            $('#' + id + '.state').removeClass("glyphicon glyphicon-ok-circle");
                            $('#' + id + '.state').addClass("screen-open");
                            $('#' + id + '.state').addClass("glyphicon glyphicon-exclamation-sign");

                            $("#screen-state-toggle").attr("title", "Close Screen");
                            $("#screen-state-icon").addClass("class=fa fa-toggle-off");
                            $("#screen-state-icon").removeClass("class=fa fa-toggle-on");
                        }
                        else {
                            $('#' + id).css("opacity", "0.5");
                            $('#' + id + '.state').removeClass("glyphicon glyphicon-exclamation-sign");
                            $('#' + id + '.state').removeClass("screen-open");
                            $('#' + id + '.state').addClass("screen-closed");
                            $('#' + id + '.state').addClass("glyphicon glyphicon-ok-circle");

                            $("#screen-state-toggle").attr("title", "Re-open Screen");
                            $("#screen-state-icon").addClass("class=fa fa-toggle-on");
                            $("#screen-state-icon").removeClass("class=fa fa-toggle-off");
                        }
                    }
                });
        });
    });


    $("#review-state-toggle").on('click', function () {

        var reviewData = {

            "ReviewId": $("#ReviewId").val(),
            "Open": $("#review-state").hasClass('review_closed') ? true : false
        };

        $.ajax({

            type: "POST", //HTTP POST Method  
            url: "../CloseReview", // Controller/View  
            contentType: "application/json;",
            dataType: "text",
            data: JSON.stringify(reviewData),
            success: function (response) {

                if (response == 1) {
                    $("#review-state-toggle").attr("title", "Re-open Review");
                    $("#review-state-icon").addClass("fa fa-toggle-on");
                    $("#review-state-icon").removeClass("fa fa-toggle-off");
                    $("#review-state").html("Review :Closed");
                }
                else {
                    $("#review-state-toggle").attr("title", "Close Review");
                    $("#review-state-icon").addClass("fa fa-toggle-off");
                    $("#review-state-icon").removeClass("fa fa-toggle-on");
                    $("#review-state").html("Review :Open");
                }
            }
        });
    });

    $('#update-reviewers').on('click', function () {

        var UpdatingUser = {

            "ReviewId": $("#ReviewId").val(),
            "ScreenId": $("ScreenId").val(),
            "ToRemove": [],
            "ToAdd": []
        };

        var checkedStates = $('input[id ^= "reviewer-"]');
        var profileNames = $('label[id ^= "profilename-"]');
        var Ids = $('input[id ^= "id-"]');

        var currentReviewers = $('p[id ^= "reviewers-name-"]');
        var currentProfileNames = [];
        for (i = 0; i < currentReviewers.length; i++)
        {
            currentProfileNames.push(currentReviewers[i].innerText);
        }

        for (i = 0; i < checkedStates.length; i++)
        {
            var match = ($.inArray(profileNames[i].innerText, currentProfileNames));
            if (checkedStates[i].checked && match === -1)
            {
                UpdatingUser.ToAdd.push(Ids[i].value)
            }

            if (!checkedStates[i].checked && match > -1) {

                UpdatingUser.ToRemove.push(Ids[i].value)
            }
        }

        $.ajax({

            type: "POST",
            url: "../Update_Reviewers",
            contentType: "application/json",
            dataType: "text",
            data: JSON.stringify(UpdatingUser),
            success: function (response) {

                obj = JSON.parse(response);
                objCount = Object.keys(obj).length;

                $("#reviewees-section").html("");
                var author = $("#authour-section > #reviewers-name")[0];
                for (i = 0; i < objCount; i++)
                {
                    if (obj[i].profileName != author.textContent)
                    {
                        $('<img />', {
                            id: 'reviewers-avatar',
                            src: obj[i].avatar,
                            style: 'width:20px;height:20px;'
                        }).appendTo("#reviewees-section");

                        $('<p />', {
                            id: 'reviewers-name-' + i,
                            class: 'reviewers-section-names',
                            text: obj[i].profileName
                        }).appendTo("#reviewees-section");

                        $('<i />', {
                            class: 'fa fa-thumbs-o-up',
                        }).appendTo("#reviewees-section");
                    }
                }
            }
        })
    });
})