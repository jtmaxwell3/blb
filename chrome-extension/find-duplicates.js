const conjugate = require('./conjugate.js')

function find_duplicates() {
    var english_to_strongs = {};
    var duplicates = 0;
    var singletons = 0;
    for (let strongs in conjugate.strongs_to_english) {
        if (strongs[0] == 'H') continue;
        let english = conjugate.get_English_for_Strongs(strongs, "")[0];
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