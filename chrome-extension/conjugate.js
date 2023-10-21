let node_strongs_to_english;
if (typeof window === 'undefined') {
    // This is so we can run tests using node.js.
    node_strongs_to_english = require('./strongs-to-english.js')
}

function conjugate(description) {
    let pos1 = description.search("Transliteration:")
    let pos2 = description.search("Hebrew:")
    let pos3 = description.search("English:")
    let section1 = description.substring(pos1 + 16, pos2).trim();
    let section2 = description.substring(pos2 + 7, pos3).trim();
    let section3 = description.substring(pos3 + 8, description.length).trim();
    let words = section1.trim().split(/\s+/);
    let transliteration = words[0];
    let strongs = words[5];
    strongs = strongs.substring(1, strongs.length - 1);
    let forms = section2.split(";")
    return conjugate_Hebrew_as_English(transliteration, strongs, forms)
}

function conjugate_Hebrew_as_English(transliteration, strongs, forms) {
    return get_English_for_Strongs(strongs)
}

function get_English_for_Strongs(strongs) {
    if (node_strongs_to_english) {
        // This is so we can run tests using node.js.
        return node_strongs_to_english[strongs]
    } else {
        return strongs_to_english[strongs]
    }
}

if (typeof window === 'undefined') {
    // This is so we can run tests using node.js.
    module.exports = conjugate;
}
