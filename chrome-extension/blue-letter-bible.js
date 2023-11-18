console.log('blue-letter-bible.js loaded!');
// Move the page continuation before the examples.
var pageCont = document.getElementById('pageCont');
var lexResults = document.getElementById('lexResults');
var bibleTable = document. getElementById('bibleTable');
var header = null;
if (pageCont && lexResults && bibleTable) {
  pageCont.remove();
  lexResults.insertBefore(pageCont, bibleTable);
  header = pageCont.children[0];
  if (header && header.children[0] && header.children[0].children[0]) {
    header.children[0].children[0].textContext = 'Search Results';
    header = header.children[0];
    if (header) {
      header = header.children[0];
      if (header) {
        header.textContent = 'Search Results';
      }
    }
  }
}
const observer = new MutationObserver((mutations, observer) => {
    for (let i = 0; i < mutations.length; i++) {
        const mutation = mutations[i]
        // console.log("mutation", mutation.target.id)
        if (mutation.target.id == "interruptDiv"  || mutation.target.id == "bodTag") {
            // interruptDiv is for search results, bodTag is for Strong's entries
            const header_rows = mutation.target.getElementsByClassName("header-row");
            if (header_rows.length == 1) {
                const header_row = header_rows[0]
                const rows = mutation.target.getElementsByClassName("row");
                if (rows.length > 0 && !rows[0].children[4]) {
                    continue;
                }
                // Check whether there is a row with Hebrew.
                var valid_row = false;
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const parseDiv = row.children[4].children[0];
                    if (parseDiv.title.indexOf("Hebrew:") != -1) {
                        valid_row = true;
                    }
                }
                if (!valid_row) {
                    return;
                }
                // Add conjugation header to header row.
                const conjugationHeader = document.createElement("div")
                const newTitle = document.createTextNode("Literal");
                conjugationHeader.appendChild(newTitle);
                conjugationHeader.classList = header_row.children[1].classList
                header_row.children[4].remove()
                header_row.children[3].remove()
                header_row.children[1].after(conjugationHeader)
                // Add conjugation element to each row.
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i]
                    const parseDiv = row.children[4].children[0]
                    const conjugationDiv = document.createElement("div")
                    const conjugation = conjugate(parseDiv.title)
                    const conjugationTextNode = document.createTextNode(conjugation);
                    conjugationDiv.appendChild(conjugationTextNode);
                    conjugationDiv.classList = row.children[1].classList
                    conjugationDiv.title = parseDiv.title
                    row.children[4].remove()
                    row.children[3].remove()
                    row.children[1].after(conjugationDiv)
                }
            }
        }
    }
});
// Get all mutations to childList in the subtrees of document.
observer.observe(document, {
  subtree: true,
  childList: true
});
