let node_strongs_to_english;
if (typeof window === 'undefined') {
    // This is so we can run tests using node.js.
    node_strongs_to_english = require('./strongs-to-english.js')
    get_plural = require('./get_plural.js')
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
    let main_part_of_speech = "";
    for (let j = 0; j < forms.length; j++) {
        let form2 = forms[j].trim()
        let parts = ["Adjective", "Adverb", "Noun", "Verb"]
        for (k = 0; k < parts.length; k++) {
            pos = parts[k]
            if (form2.startsWith(pos)) {
                main_part_of_speech = pos
            }
        }
    }
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
                } else if (term == "dual") {
                    number = "pl";
                } else if (term == "construct") {
                    construct = " of";
                } else if (term == "feminine") {
                    gender = "f";
                } else if (term == "masculine") {
                    gender = "m";
                } else if (term == "name") {
                    // Skip.
                } else if (term == "plural") {
                    number = "pl";
                } else if (term == "proper") {
                    // Skip.
                } else if (term == "singular") {
                    number = "sg";
                } else {
                    unknowns.push(term)
                }
            }
            // Generate conjugation.
            let conjugation = word;
            if (number == "pl" && word != "God") {
                results = get_plural(word);
                // console.log("get_plural", word, results)
                if (results[1].length == 1) {
                    conjugation = results[1][0].substring(3);
                }
            }
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
                } else if (term == "demonstrative") {
                    conjugation = word;
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
            // Is this an attached preposition?
            if (main_part_of_speech == "") {
                conjugations.push(word);
            } else if (transliteration[0] == "b") {
                conjugations.push("in");
            } else if (transliteration[0] == "l") {
                conjugations.push("to");
            } else if (transliteration[0] == "m") {
                conjugations.push("from");
            } else {
                unknowns.push(terms[0]);
            }
            for (let j = 1; j < terms.length; j++) {
                unknowns.push(terms[j]);
            }
        } else if (terms[0] == "Suffix") {
                        let gender = "";
            let number = "";
            let person = "";
            let voice = "";
            // Process terms.
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "feminine") {
                    gender = "f";
                } else if (term == "first") {
                    number = "1";
                } else if (term == "masculine") {
                    gender = "m";
                } else if (term == "plural") {
                    number = "pl";
                } else if (term == "pronominal") {
                    // Skip.
                } else if (term == "person") {
                    // Skip.
                } else if (term == "second") {
                    person = "2";
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
            if (main_part_of_speech == "Noun") {
                if (person == "1") {
                    if (number == "sg") {
                        conjugation = "my";
                    } else {
                        conjugation = "our";
                    }
                } else if (person == "2") {
                    conjugation = "your (" + gender + number + ")";
                } else if (person == "3") {
                    if (number == "sg") {
                        if (gender == "f") {
                            conjugation = "hers/its";
                        } else if (gender == "m") {
                            conjugation = "his/its";
                        } else {
                            conjugation = "his/hers/its";
                        }
                    } else {
                        conjugation = "their (" + gender + ")";
                    }
                }
                // Put the conjugation before the prior form.
                conjugations.splice(conjugations.length - 1, 0, conjugation)
            } else {
                if (person == "1") {
                    if (number == "sg") {
                        conjugation = "me";
                    } else {
                        conjugation = "us";
                    }
                } else if (person == "2") {
                    conjugation = "you (" + gender + number + ")";
                } else if (person == "3") {
                    if (number == "sg") {
                        if (gender == "f") {
                            conjugation = "her/it";
                        } else if (gender == "m") {
                            conjugation = "him/it";
                        } else {
                            conjugation = "him/her/it";
                        }
                    } else {
                        conjugation = "them (" + gender + ")";
                    }
                }
                conjugations.push(conjugation)
            }
        } else if (terms[0] == "Verb") {
            let gender = "";
            let number = "";
            let person = "";
            let voice = "";
            let imperfect = false;
            let imperative = false;
            // Process terms.
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "feminine") {
                    gender = "f";
                } else if (term == "first") {
                    person = "1";
                } else if (term == "imperative") {
                    imperative = true;
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
                } else if (term == "second") {
                    person = "2";
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
            if (imperative) {
                conjugation += "!"
            }
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
        console.log(transliteration, word, "unknowns = ", unknowns)
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
