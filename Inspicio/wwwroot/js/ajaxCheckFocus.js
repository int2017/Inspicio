function checkFocus(id, flag) {


    $.ajax({
        url: "/Account/CompareTime",
        type: 'POST',
        data: {
            id: id,
            flag: flag
        },
        success: function (response) {

            if (!document.hasFocus()) {
                setTimeout(function ()
                {
                    checkFocus(id, true)
                }
                    , 30000);

            }
            else {
                setTimeout(function () {
                    checkFocus(id, false)
                }
                    , 30000);
            }
        }
    });

};