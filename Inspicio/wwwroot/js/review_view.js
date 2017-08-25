$(document).ready(function () {

    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("toggle_review_info");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
        $('body').addClass('modal-open');
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    /*add reviewees modal*/
    // Get the modal
    var modal1 = document.getElementById('add-reviewees-modal');

    // Get the button that opens the modal
    var btn1 = document.getElementById("new-reviewees-section");
    if (btn1 != null) {
        // When the user clicks on the button, open the modal 
        btn1.onclick = function () {

            $(window).scrollTop(0);

            modal1.style.display = "block";
            $('body').addClass('modal-open');
        }
    }

    $('#update-reviewers').on('click', function () {

        var UpdatingUser = {

            "ReviewId": $("#ReviewId").val(),
            "ScreenId": $("#ScreenId").val(),
            "ToRemove": [],
            "ToAdd": []
        };
        if (UpdatingUser.ScreenId === undefined) {
            UpdatingUser.ScreenId = -1;
        }
        var checkedStates = $('input[id ^= "reviewer-"]');
        var profileNames = $('label[id ^= "profilename-"]');
        var Ids = $('input[id ^= "id-"]');

        var currentReviewers = $('p[id ^= "reviewers-name-"]');
        var currentProfileNames = [];
        for (i = 0; i < currentReviewers.length; i++) {
            currentProfileNames.push(currentReviewers[i].innerText);
        }

        for (i = 0; i < checkedStates.length; i++) {
            var match = ($.inArray(profileNames[i].innerText, currentProfileNames));
            if (checkedStates[i].checked && match === -1) {
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
                for (i = 0; i < objCount; i++) {
                    if (obj[i].profileName != author.textContent)
                    {

                        var ratingClass = "";
                        switch (obj[i].rating) {
                            case "Approved":
                                ratingClass = "fa fa-thumbs-o-up";
                                break;
                            case "NeedsWork":
                                ratingClass = "fa fa-thumbs-o-up fa-rotate-90";
                                break;
                            case "Rejected":
                                ratingClass = "fa fa-thumbs-o-down";
                                break;
                            case "Undecided":
                                ratingClass = "fa fa-question-circle-o";
                                break;
                            default:
                                ratingClass = "fa fa-question-circle-o";
                        }

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
                            class: ratingClass,
                        }).appendTo("#reviewees-section");
                    }
                }


                modal1.style.display = "none";
                $('body').removeClass('modal-open')
            }
        })
    });
});