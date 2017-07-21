function alphasort(n) {
    if (document.getElementById('alphasort').checked) {
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
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

                        shouldSwitch = true;
                        break;
                    }
                } else if (dir === "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {

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


/*
function alphasort() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("table");
    switching = true;

    while (switching) {

        switching = false;
        rows = table.getElementsByTagName("TR");

        for (i = 1; i < (rows.length - 1); i++) {

            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}


function test() {
    test = document.getElementById("test")
    test.style.display = "none";
}

function alphasort() {
    window.alert("1");
    var temp = 0;
    var i = 0;
    var table, tr, td;
    table = document.getElementById("table");
    td = table.getElementsByTagName("td");
    
    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("TR");
        for (i = 0; i < rows.length; i++) {
            window.alert("2");
            tdTitle = td[i].getElementsByTagName("td");
            if (td[i] > td[i + 1]) {
                window.alert("3");
                temp = td[i];
                td[i + 1] = td[i];
                td[i] = td[i + 1];
            }
            else if (td[i] < td[i - 1]) {
                window.alert("4");
                temp = td[i];
                td[i - 1] = temp;
                td[i] = td[i - 1];
            }
            else {
                window.alert("5");
            }
        }
    }
};*/
