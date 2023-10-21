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
        if (mutation.target.id == "interruptDiv") {
            // This is the only mutation we see from document.
            console.log(mutation.target)
            const header_rows = mutation.target.getElementsByClassName("header-row");
            if (header_rows.length == 1) {
                console.log('Got header row')
                const header_row = header_rows[0]
                // Add conjugation header to header row.
                const conjugationHeader = document.createElement("div")
                const newTitle = document.createTextNode("Conjugation");
                conjugationHeader.appendChild(newTitle);
                conjugationHeader.classList = header_row.children[1].classList
                header_row.children[4].remove()
                header_row.children[3].remove()
                header_row.children[1].after(conjugationHeader)
                console.log('Added to header row')
                // Add conjugation element to each row.
                const rows = mutation.target.getElementsByClassName("row");
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
                    console.log('Added to row')
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
