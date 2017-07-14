function searchFunction() {

    var input, filter, table, tr, td, i; 
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");

  // Loops through table rows, and hides ones that don't match the search query
  for (i = 0; i < tr.length; i++) {
      tdTitle = tr[i].getElementsByTagName("td")[1];
      tdDescription = tr[i].getElementsByTagName("td")[2];
      if (tdTitle) {
          if (tdTitle.innerHTML.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          }
          else if (tdDescription.innerHTML.toUpperCase().indexOf(filter) > -1){
              tr[i].style.display = "";
           }
        else {
            tr[i].style.display = "none";
        }
    }
  }
}