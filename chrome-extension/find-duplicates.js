let node_strongs_to_english;
let strongs_to_english_override;
strongs_to_english = require('./strongs-to-english.js')
strongs_to_english_override = require('./strongs-to-english-override.js')

function get_English_for_Strongs(strongs, terms) {
    if (!strongs) {
        return ["", terms]
    }
    if (strongs in strongs_to_english_override) {
        let entry = strongs_to_english_override[strongs];
        if (typeof entry == "string") {
            return [entry, terms]
        }
        for (let i = 0; i < entry.length; i++) {
            let item = entry[i];
            if (typeof item == "string") {
                return [item, terms]
            }
            if (is_subset(item[1], terms)) {
                if (!item[2]) {
                    return [item[0], terms]
                }
                // Replace item[1] with item[2] in terms.
                let new_terms = item[2].concat(terms.slice(item[1].length))
                return [item[0], new_terms]
            }
        }
    }
    return [strongs_to_english[strongs], terms]
}

function is_subset(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
        if (!array2.includes(array1[i])) {
            return false
        }
    }
    return true
}

function find_duplicates() {
    var english_to_strongs = {};
    var duplicates = 0;
    var singletons = 0;
    for (let strongs in strongs_to_english) {
        let english = get_English_for_Strongs(strongs, "")[0];
        if (!(english in english_to_strongs)) {
            english_to_strongs[english] = [];
        }
        value = english_to_strongs[english];
        value.push(strongs)
    }
    for (let english in english_to_strongs) {
        strongs = english_to_strongs[english];
        if (strongs.length > 1) {
            console.log(english, strongs);
            duplicates = duplicates + strongs.length;
        } else {
            singletons = singletons + 1;
        }
    }
    console.log(duplicates, "duplicates")
    console.log(singletons, "singletons")
}

find_duplicates();