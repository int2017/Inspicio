/*function test() {
    test = document.getElementById("test")
    test.style.display = "none";
}*/

function alphasort() {
    window.alert("1");
    var temp = 0;
    var i = 0;
    var table, tr, td;
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    td = table.getElementsByTagName("td");

    for (i = 0; i < tr.length; i++) {
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

};
