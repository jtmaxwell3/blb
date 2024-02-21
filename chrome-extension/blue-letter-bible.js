// Move the page continuation before the examples.
var pageCont = document.getElementById('pageCont');
var lexResults = document.getElementById('lexResults');
var bibleTable = document.getElementById('bibleTable');
var header = null;
if (bibleTable) {
    var strongs = new Map();
    count_strongs(bibleTable, strongs);
    highlight_repeated_strongs(bibleTable, strongs);
}
function count_strongs(element, strongs) {
    var id = get_strongs(element);
    if (id) {
        if (!(id in strongs)) {
            strongs[id] = 0;
        }
        strongs[id] = strongs[id] + 1;
    }
    if (element.children) {
        for (let i = 0; i < element.children.length; i++) {
            count_strongs(element.children[i], strongs);
        }
    }
}
function highlight_repeated_strongs(element, strongs) {
    if (element.childNodes) {
       var new_elements = [];
       for (let i = 0; i < element.childNodes.length; i++) {
            var id = get_strongs(element.childNodes[i]);
            if (id && strongs[id] > 1) {
                var textNode = element.childNodes[i - 1];
                var content = textNode.nodeValue;
                if (!content) continue;
                var space1 = content.lastIndexOf(' ');
                var bold = document.createElement('strong');
                if (space1 < 1) {
                    // Make the content bold.
                    bold.appendChild(document.createTextNode(content));
                    element.replaceChild(bold, textNode);
                } else {
                    // Make the last word bold.
                    var bold_content = content.substring(space1, content.length);
                    bold.appendChild(document.createTextNode(bold_content));
                    textNode.nodeValue = content.substring(0, space1);
                    // Don't add new elements during iteration.
                    new_elements.push([textNode, bold])
                }
            }
        }
        for (let i = 0; i < new_elements.length; i++) {
            var textNode = new_elements[i][0];
            var bold = new_elements[i][1];
            textNode.after(bold);
        }
    }
    if (element.children) {
        for (let i = 0; i < element.children.length; i++) {
            highlight_repeated_strongs(element.children[i], strongs);
        }
    }
}
function get_strongs(element) {
    if (element.classList && element.classList.contains("strongs")) {
        return element.children[0].childNodes[0].data;
    }
}

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
                // Check whether there is a valid row.
                var valid_row = false;
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const parseDiv = row.children[4].children[0];
                    if (parseDiv.title.indexOf("Hebrew:") != -1) {
                        valid_row = true;
                    }
                    if (parseDiv.title.indexOf("Aramaic:") != -1) {
                        valid_row = true;
                    }
                }
                if (!valid_row) {
                    return;
                }
                // Add conjugation header to header row.
                const conjugationHeader = document.createElement("div")
                const newTitle = document.createTextNode("Gloss");
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
console.log('blue-letter-bible.js loaded!');
