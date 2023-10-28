let node_strongs_to_english;
if (typeof window === 'undefined') {
    // This is so we can run tests using node.js.
    node_strongs_to_english = require('./strongs-to-english.js')
}

function conjugate(description) {
    if  (!description) {
        return ""
    }
    let pos1 = description.search("Transliteration:");
    let pos2 = description.search("Hebrew:");
    let pos3 = description.search("English:");
    if (pos3 == -1) {
        pos3 = description.length;
    }
    let section1 = description.substring(pos1 + 16, pos2).trim();
    let section2 = description.substring(pos2 + 7, pos3).trim();
    let section3 = description.substring(pos3 + 8, description.length).trim();
    let words = section1.trim().split(/\s+/);
    let transliteration = words[0];
    let strongs = words[5];
    if (strongs) {
        strongs = strongs.substring(1, strongs.length - 1);
    }
    let forms = section2.split(";")
    return conjugate_Hebrew_as_English(transliteration, strongs, forms)
}

function conjugate_Hebrew_as_English(transliteration, strongs, forms) {
    let conjugations = [];
    let unknowns = [];
    let word = get_English_for_Strongs(strongs)
    // Conjugate the forms.
    for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        // Split the form into terms.
        const terms = form.trim().split(/\s+/);
        let conjugation = "";
        // Branch on the first term.
        if (terms[0] == "Conjunction") {
            conjugations.push("and");
        } else if (terms[0] == "Noun") {
            let gender = "";
            let number = "";
            let construct = "";
            // Process terms.
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "absolute") {
                    // Skip.
                } else if (term == "both") {
                    // Skip.
                } else if (term == "common") {
                    // skip.
                } else if (term == "construct") {
                    construct = " of";
                } else if (term == "feminine") {
                    gender = "f";
                } else if (term == "masculine") {
                    gender = "m";
                } else if (term == "plural") {
                    number = "pl";
                } else if (term == "singular") {
                    number = "sg";
                } else {
                    unknowns.push(term)
                }
            }
            // Generate conjugation.
            let conjugation = word;
            if (gender != "") {
                conjugation += " (" + gender + ")"
            }
            conjugation += construct;
            conjugations.push(conjugation);
        } else if (terms[0] == "Particle") {
            let conjugation = "";
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "article") {
                    // Skip.
                } else if (term == "definite") {
                    conjugation = "the";
                } else if (term == "direct") {
                    conjugation = word;
                } else if (term == "marker") {
                    // Skip.
                } else if (term == "object") {
                    // Skip.
                } else {
                    unknowns.push(term)
                }
            }
            conjugations.push(conjugation);
        } else if (terms[0] == "Preposition") {
            if (transliteration[0] == "b") {
                conjugations.push("in")
            } else {
                unknowns.push(terms[0]);
            }
            for (let j = 1; j < terms.length; j++) {
                unknowns.push(terms[j]);
            }
        } else if (terms[0] == "Verb") {
            let gender = "";
            let number = "";
            let person = "";
            let voice = "";
            let imperfect = false;
            // Process terms.
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "feminine") {
                    gender = "f";
                } else if (term == "masculine") {
                    gender = "m";
                } else if (term == "plural") {
                    number = "pl";
                } else if (term == "qal") {
                    // Skip.
                } else if (term == "perfect") {
                    // Skip.
                } else if (term == "person") {
                    // Skip.
                } else if (term == "singular") {
                    number = "sg";
                } else if (term == "third") {
                    person = "3";
                } else {
                    unknowns.push(term)
                }
            }
            // Generate conjugation.
            let conjugation = "";
            if (gender != "" || number != "" || person != "") {
                if (person == "1") {
                    if (number == "sg") {
                        conjugation = "I";
                    } else {
                        conjugation = "we";
                    }
                } else if (person == "2") {
                    conjugation = "you (" + gender + number + ")";
                } else if (person == "3") {
                    conjugation = "(" + person + gender + number + ")";
                }
                conjugation += " ";
            }
            conjugation += word;
            conjugations.push(conjugation);
        } else {
            unknowns.push(terms[0])
        }
    }
    // Combine conjugations.
    result = "";
    for (let i = 0; i < conjugations.length; i++) {
        if (i > 0) {
            result += " ";
        }
        result += conjugations[i];
    }
    // Deal with unknowns.
    if (unknowns.length > 0) {
        console.log(transliteration, "unknowns = ", unknowns)
        if (result == "") {
            result = word;
        }
        result += " ???";
    }
    return result;
}

function get_English_for_Strongs(strongs) {
    if (!strongs) {
        return ""
    }
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
