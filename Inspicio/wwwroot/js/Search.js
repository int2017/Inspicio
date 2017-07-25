﻿$("#myInput").on("keyup",function () {
    
        var input, filter, table, tr, td, i;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("table");
        tr = table.getElementsByTagName("tr");

        // Loops through table rows, and hides ones that don't match the search query
        for (i = 0; i < tr.length; i++) {
            tdTitle = tr[i].getElementsByTagName("td")[1];
            tdCreator = tr[i].getElementsByTagName("td")[2];
            if (tdTitle) {
                if (tdTitle.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
                else if (tdCreator.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
                else {
                    tr[i].style.display = "none";
                }
            }
        }
});
/*
function alphasort() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    var temp = 0

    for (i = 0; i < tr.length; i++) {
        tdTitle = tr[i].getElementsByTagName("td")[1];
        if (tdTitle) {
            if (tdTitle[i] > tdTitle[i+1]) {
                temp = tdTitle[i];
                tdTitle[i] = tdTitle[i + 1];
                tdTitle[i + 1] = temp;
            }
            else if (tdTitle[i] < tdTitle[i-1]) {
                temp = tdTitle[i];
                tdTitle[i] = tdTitle[i - 1];
                tdTitle[i - 1] = temp;
            }

        }
    }
};
*/


