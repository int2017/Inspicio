
$(document).on("click", ".TitleHeader", function () {

    sort(1);
});

$(document).on("click", ".CreatorHeader", function () {
    sort(2);
});

$(document).on("click", ".StatusHeader", function () {

    sort(6);
});

function sort(by_column)
{
    var table, rows, switching, currentRow, currentColumn, nextColumn, switchcount = 0;
    table = document.getElementById("table");
    switching = true;

    var shouldSwitch = false;
    var dir = "asc";
    while (switching)
    {

        switching = false;
        rows = table.getElementsByTagName("TR");

        for (currentRow = 1; currentRow < (rows.length - 1); currentRow++)
        {

            shouldSwitch = false;

            currentColumn = rows[currentRow].getElementsByTagName("TD")[by_column];
            nextColumn = rows[currentRow + 1].getElementsByTagName("TD")[by_column];

            if (dir === "asc")
            {
                if (currentColumn.innerHTML.toLowerCase() > nextColumn.innerHTML.toLowerCase())
                {

                    shouldSwitch = true;
                    break;
                }
            }
            else if (dir === "desc")
            {
                if (currentColumn.innerHTML.toLowerCase() < nextColumn.innerHTML.toLowerCase())
                {

                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch)
        {

            rows[currentRow].parentNode.insertBefore(rows[currentRow + 1], rows[currentRow]);
            switching = true;

            switchcount++;
        }
        else
        {

            if (switchcount === 0 && dir === "asc")
            {
                dir = "desc";
                switching = true;
            }
        }
    }

    rows[0].getElementsByTagName("TH")[1].innerText = "Title"
    rows[0].getElementsByTagName("TH")[2].innerText = "Creator";
    rows[0].getElementsByTagName("TH")[6].innerText = "Status";

    var full_header = rows[0].getElementsByTagName("TH")[by_column];
    if (dir === "asc")
    {
        var header_text = full_header.innerText.split(" ");
        full_header.innerText = header_text[0] + " ▲";
    }

    else 
    {
        var header_text = full_header.innerText.split(" ");
        full_header.innerText = header_text[0] + " ▼";
    }
}