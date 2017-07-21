function OCSort(n) {
    if (document.getElementById('OCSort').checked) {
        var table, rows, switching, i, x, y, switchcount = 0;
        table = document.getElementById("table");
        switching = true;

        var shouldSwitch = false;
        var dir = "asc";
        while (switching) {

            switching = false;
            rows = table.getElementsByTagName("TR");

            for (i = 1; i < (rows.length - 1); i++) {

                shouldSwitch = false;

                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];

                if (dir === "asc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {

                        shouldSwitch = true;
                        break;
                    }
                } else if (dir === "desc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {

                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;

                switchcount++;
            } else {

                if (switchcount === 0 && dir === "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }
    else {
        $("#tBody").load(window.location.href + " #tBody > *");
    }
}






/*function OCSort(n) {

    var input, table, tr, td, i;
    input = document.getElementById("myInput");
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");

    // Loops through table rows, and hides ones that don't match the search query
    for (i = 0; i < tr.length; i++) {
        tdTitle = tr[i].getElementsByTagName("td")[n];
            if (tr[i] === open) {
                tr[i].style.display = "";
            }
            else {
                tr[i].style.display = "none";
        }
    }
}*/


/*function OCSort(n) {
    var table, rows, switching, i, x, y, switchcount = 0;
    table = document.getElementById("table");
    var dir = "asc";

    rows = table.getElementsByTagName("TR");
    x = rows[i].getElementsByTagName("TD")[n];

    for (i = 1; i < (rows.length - 1); i++) {
        

        if (x == "Closed") {
            rows.
        }
    }
}*/