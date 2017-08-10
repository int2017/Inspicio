var section = 2;
$(document).on("click", "#choice-feature", function () {
    $("#action-choice").fadeOut(300);
    $("#feature-demo").delay(300).fadeIn(300);

})
function switchSection() {

    $("#section" + (section - 1) + " .success").slideDown(500);
    setTimeout(function () {
        $("#progr" + (section - 1)).css("display", "flex");
        $("#progr" + (section - 1)).width("33%");
        $("[id^='section'").fadeOut(400);

        $("#section" + section).delay(400).css("display", "flex").hide().fadeIn(400);
        section++;
    }, 1500)


}

$(".switch-section").click(function () {
    if ($("#chatbot-check").is(":checked")) {
        switchSection();
        enablePins();

    } else alert("Select people for your review first!")
})
//Pins
function commentClick(uniqID) {
    var urgent = $(".urgency-popup").is(":checked");
    var urgency;
    if (urgent) {
        urgency = commentEnum.Urgent;
    } else urgency = commentEnum.Default;
    createCommentRowHome($(".popup-textarea").val(), uniqID, urgency);
}
var commentEnum = {
    Default: 0,
    Urgent: 1
};
var markersArray = new Array();
var popupsArray = new Array();

//Creates initial text
function createBtn(uniqID) {

    var btn = "<button onclick='commentClick(" + uniqID + ")' class='btn btn-success popup-btn'> <i class='glyphicon glyphicon-share-alt'></i></button>";
    Math.floor(Math.random() * 100);
    var strng = "<div id='popup" + uniqID + "' class='container-fluid popup-comment-container'></div> <div id=popupinput" + uniqID + "' class='row comment-popup-input'><div class='col-xs-4 col-sm-4 col-md-4 text-center'>You</div><div class='col-xs-8 col-sm-8 col-md-8 input-group'><textarea id='popuptext" + uniqID + "' rows= '2' class='form-control popup-textarea' o id='popuptext" + uniqID + "' ></textarea ><div class='comment-status'><label><input type='checkbox' class='urgency-popup'>Urgent</label></div> <span class='input-group-btn'> " + btn + " </span></div > ";
    return strng;
}

//Creating a new comment row
function createCommentRowHome(comment, uniqID, urgency) {
    if ($("#progr3").width() === 0) {
        $("#section" + (section - 1) + " .success").slideDown(500);
        $("#progr3").css("display", "flex").width("34%");
    }
    var urgencyEl; //Urgency element
    if (urgency === 1) {
        urgencyEl = "<div class='urgent'><span class='glyphicon glyphicon-star' aria-hidden='true'></span></div>";
    } else urgencyEl = "";
    var row = "<div class='row-eq-height popup-comment'> <div class='col-xs-4 col-sm-4 col-md-4'><p> You </p></div><div class='col-xs-8 col-sm-8 col-md-8'>" + comment + "</div>" + urgencyEl + "</div>";
    popupX = popupsArray[popupsArray.findIndex(x => parseInt(x.myData.id) === parseInt(uniqID))];
    popupX.setContent(appendRow(row, uniqID, popupX.getContent()));


}

//Since the whole popup has to be recreated, this method clones it's previous HTML and adds a new comment row
function appendRow(row, uniqID, popupContent) {
    //When changing the HTML of a popup, this code will have to be updated!
    var openingTag = "<div id='popup" + uniqID + "' class='container-fluid popup-comment-container'>";
    var div = $(document.createElement('div'));
    div.addClass("container-fluid popup-comment-container").attr("id", "popup" + uniqID);
    var inputBox = createInputRow(uniqID);

    if (popupContent !== undefined) {
        var prevContent = popupContent.slice(openingTag.length, popupContent.length - 3 - inputBox.length);
        if (prevContent.indexOf("popupinput") < 0) {
            $(prevContent).appendTo(div);
        }
    }
    $(row).appendTo(div);
    //A new input section has to be created each time to keep things consistent, otherwise it messes up the HTML
    return openingTag + div.html() + "</div>" + inputBox;

}

function createInputRow(uniqID) {
    var btn = "<button class='btn btn-success popup-btn reply-button'> <i class='glyphicon glyphicon-share-alt'></i></button>";
    setTimeout(
        function () {
            $("#popuptext" + uniqID).keypress(function (e) {
                if (e.which === 13) {
                    commentClick(uniqID);
                }
            });
        }, 50);
    return "<div id='popupinput" + uniqID + "' class='row comment-popup-input'><div class='col-xs-4 col-sm-4 col-md-4 text-center'>You</div><div class='col-xs-8 col-sm-8 col-md-8 input-group'><textarea id='popuptext" + uniqID + "' rows= '2' class='form-control popup-textarea'></textarea > <span class='input-group-btn'> " + btn + " </span></div ></div>";
}

function replyComment(area) {
    var uniqID = $(area).attr("id").slice(9);
    createCommentRowHome($(".popup-textarea").val(), uniqID);
    $(area).val("");

}

function enablePins() {
    var imageMap = L.map("homeImageMap", {
        crs: L.CRS.Simple,
        zoomControl: false,
        unitsPer1000px: 1000
    });

    //Creates custom pin
    var customPin = L.icon({
        iconUrl: "../../images/pinNormal.svg",
        shadowUrl: "../../images/pinshadow.svg",
        iconSize: [38, 58], // size of the icon
        shadowSize: [80, 120], // size of the shadow
        iconAnchor: [15, 58], // point of the icon which will correspond to marker's location
        shadowAnchor: [11, 62], // the same for the shadow
        popupAnchor: [3, -45]
    });


    $(window).resize(function () {
        setTimeout(
            function () {
                imageMap.invalidateSize();
            }, 1000);

    });
    //Disabling all the controls for the map
    var markerGroup = L.featureGroup().addTo(imageMap);
    imageMap.dragging.disable();
    imageMap.touchZoom.disable();
    imageMap.doubleClickZoom.disable();
    imageMap.scrollWheelZoom.disable();
    imageMap.boxZoom.disable();
    imageMap.keyboard.disable();
    imageMap.setView([0, 0]);
    //Setting the bounds
    setTimeout(function () {
        var height = $("#image-container img").height();
        var width = $("#image-container img").width();
        var bound = [
            [0, 0],
            [height, width]
        ];
        imageMap.fitBounds(bound);
        activateChatBot();
    }, 3000)

    if (imageMap.tap) imageMap.tap.disable();

    imageMap.on('click', function (e) {

        mapOnClick(e);
    });

    //Button control
    $(".leaflet-map-pane").attr("id", "map-pane");

    function mapOnClick(e) {
        alert(e.latlng);
        createMarker(e.latlng);
    }
    //Creating individual markers

    var locations = [
        []
    ];

    function createMarker(latlng) {
        var uniqID = Math.round(new Date().getTime() + (Math.random() * 100));
        var marker = new L.marker(latlng, {
            icon: customPin
        }).addTo(markerGroup);
        var popup = new L.responsivePopup({
            offset: [10, 10],
            autoPanPadding: [10, 10]
        });
        //Removes marker if popup is empty
        marker.on('popupclose', function (e) {
            if (($("#popup" + uniqID).html().indexOf("popup-comment")) === -1) {
                imageMap.removeLayer(marker);
            }
        });
        popup.options.autoPan = false;
        popup.options.closeOnClick = true;
        //Focusing the textarea of the popup
        marker.on("click", function () {
            setTimeout(
                function () {
                    $("#popuptext" + uniqID).focus();
                }, 50);

        });
        popup.myData = {
            id: uniqID
        };
        popupsArray.push(popup);
        markersArray.push(marker);
        locations.push(latlng);
        marker.bindPopup(popup);
        marker.myData = {
            id: uniqID
        };
        popup.setContent(createBtn(uniqID));
        marker.openPopup();
        $(".popup-textarea").focus();
        return uniqID;
    }



    //Live listeners
    $(document).ready(function () {
        $(document).on("keypress", ".reply-textarea", function (e) {
            if (e.which === 13) {
                var parent = $(this).attr("id").slice(5);
                $("#button-" + parent).click();
                // prevent duplicate submission
                return false;
            }
        });
        $(document).on("click", ".reply-button", function () {
            var area;
            var parent = $(this).data("parent");
            area = $(".popup-textarea");
            replyComment(area);

        });
    });




    //Chatbot
    function activateChatBot() {
        setTimeout(function () {
            var width = $("#homeImageMap").width();
            var height = $("#homeImageMap").height();
            var loc = new L.latLng(Math.random(),Math.random());
            var uniqID = createMarker(loc);
            
            setTimeout(function () {
                createCommentRowHome(lineGenerator("first"), uniqID, commentEnum.Default);
            },1000)
            
        }, 1000);
    }
    function lineGenerator(whatResponse) {
        var firstLines = [
            "These are great colors!",
            "I like your taste :)",
            "Did you actually create this?",
            "When will this be functional?",
            "To be honest, this is pretty horrible. Why not add some life to the interface?",
            "This is why we are about to become bankrupt.",
            "I like this more than your last design!",
            "I hope you actually get this finished by next week"
        ];
        if (whatResponse === "first") {
            var rnd = Math.random() * firstLines.length;
            return firstLines[parseInt(rnd, 10)];
        }
        
    }
}