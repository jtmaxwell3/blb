let node_strongs_to_english;
if (typeof window === 'undefined') {
    // This is so we can run tests using node.js.
    node_strongs_to_english = require('./strongs-to-english.js')
    get_plural = require('./get_plural.js')
    get_conjugation = require('./get_conjugation.js')
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
                    number = "p";
                } else if (term == "construct") {
                    construct = " of";
                } else if (term == "feminine") {
                    gender = "f";
                } else if (term == "masculine") {
                    gender = "m";
                } else if (term == "name") {
                    // Skip.
                } else if (term == "plural") {
                    number = "p";
                } else if (term == "proper") {
                    // Skip.
                } else if (term == "singular") {
                    number = "s";
                } else {
                    unknowns.push(term)
                }
            }
            // Generate conjugation.
            let conjugation = word;
            if (number == "p" && word != "God") {
                conjugation = get_noun_inflection(word, "PL");
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
            if (main_part_of_speech == "") {
                conjugations.push(word);
            } else {
                // This is an attached preposition.
                preposition = transliteration.substring(0, 2);
                if (preposition == "vᵊ") {
                    // Skip the vav.
                    preposition = transliteration.substring(2, 4);
                }
                if (preposition[0] == "b") {
                    conjugations.push("in");
                } else if (preposition[0] == "l") {
                    conjugations.push("to");
                } else if (preposition[0] == "m") {
                    conjugations.push("from");
                } else {
                    unknowns.push(preposition);
                }
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
                if (term == "common") {
                    // Skip.
                } else if (term == "feminine") {
                    gender = "f";
                } else if (term == "first") {
                    person = "1";
                } else if (term == "masculine") {
                    gender = "m";
                } else if (term == "plural") {
                    number = "p";
                } else if (term == "pronominal") {
                    // Skip.
                } else if (term == "person") {
                    // Skip.
                } else if (term == "second") {
                    person = "2";
                } else if (term == "singular") {
                    number = "s";
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
                    if (number == "s") {
                        conjugation = "my";
                    } else {
                        conjugation = "our";
                    }
                } else if (person == "2") {
                    conjugation = "your (" + gender + number + ")";
                } else if (person == "3") {
                    if (number == "s") {
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
                conjugation = get_object_pronoun(person, gender, number);
                conjugations.push(conjugation)
            }
        } else if (terms[0] == "Verb") {
            let gender = "";
            let number = "";
            let person = "";
            let voice = "";
            let causative = false;
            let construct = false;
            let imperative = false;
            let imperfect = false;
            let infinitive = false;
            let intensive = false;
            let participle = false;
            let passive = false;
            let reflexive = false;
            // Process terms.
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "active") {
                    // Skip.
                } else if (term == "absolute") {
                    // Skip.
                } else if (term == "construct") {
                    construct = true;
                } else if (term == "feminine") {
                    gender = "f";
                } else if (term == "first") {
                    person = "1";
                } else if (term == "hiphil") {
                    causative = true;
                } else if (term == "hophal") {
                    causative = true;
                    passive = true;
                } else if (term == "hithpael") {
                    reflexive = true;
                } else if (term == "imperative") {
                    imperative = true;
                } else if (term == "imperfect") {
                    imperfect = true;
                } else if (term == "infinitive") {
                    infinitive = true;
                } else if (term == "masculine") {
                    gender = "m";
                } else if (term == "niphal") {
                    passive = true;
                } else if (term == "participle") {
                    participle = true;
                } else if (term == "passive") {
                    passive = true;
                } else if (term == "piel") {
                    intensive = true;
                } else if (term == "plural") {
                    number = "p";
                } else if (term == "pual") {
                    intensive = true;
                    passive = true;
                } else if (term == "qal") {
                    // Skip.
                } else if (term == "perfect") {
                    // Skip.
                } else if (term == "person") {
                    // Skip.
                } else if (term == "second") {
                    person = "2";
                } else if (term == "sequential") {
                    imperfect = true;
                } else if (term == "singular") {
                    number = "s";
                } else if (term == "third") {
                    person = "3";
                } else {
                    unknowns.push(term)
                }
            }
            // Generate conjugation.
            let verb = word;
            if (intensive) {
                verb = "really " + verb;
            }
            if (causative) {
                verb = "cause to " + verb;
            }
            if (passive) {
                if (participle || infinitive) {
                    verb = get_verb_inflection(verb, "PP")
                } else {
                    verb = "be " + get_verb_inflection(verb, "PP")
                }
            }
            if (imperfect) {
                verb = get_verb_inflection(verb, "PC");
            }
            if (reflexive) {
                verb += " " + get_reflexive_pronoun(person, gender, number);
            }
            let conjugation = verb;
            if (participle) {
                if (number == "p") {
                    conjugation = get_noun_inflection(conjugation, "PL")
                }
                if (gender) {
                    conjugation += " (" + gender + ")";
                }
            } else if (!infinitive) {
                conjugation = get_subject_pronoun(person, gender, number) + " " + verb;
            }
            if (imperative) {
                conjugation += "!"
            }
            if (construct) {
                conjugation += " of"
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

function get_noun_inflection(word, form) {
    results = get_plural(word);
    for (let i = 0; i < results[1].length; i++) {
        result = results[1][i];
        if (result.substring(0, 3) == form + ":") {
            return result.substring(3)
        }
    }
    return word;
}

function get_verb_inflection(word, form) {
    space = word.indexOf(" ")
    if (space != -1) {
        first_word = word.substring(0, space);
        remainder = word.substring(space + 1);
        if (first_word == "really") {
            return "really " + get_verb_inflection(remainder, form);
        }
        return get_verb_inflection(first_word, form) + " " + remainder;
    }
    results = get_conjugation(word);
    for (let i = 0; i < results[1].length; i++) {
        result = results[1][i];
        if (result.substring(0, 3) == form + ":") {
            return result.substring(3)
        }
    }
    return word;
}

function get_object_pronoun(person, gender, number) {
    if (person == "1") {
        if (number == "s") {
            return "me";
        } else {
            return "us";
        }
    } else if (person == "2") {
        return "you (" + gender + number + ")";
    } else if (person == "3") {
        if (number == "s") {
            if (gender == "f") {
                return "her/it";
            } else if (gender == "m") {
                return "him/it";
            } else {
                return "him/her/it";
            }
        } else {
            return "them (" + gender + ")";
        }
    }
}

function get_reflexive_pronoun(person, gender, number) {
    if (person == "1") {
        if (number == "s") {
            return "myself";
        } else {
            return "ourselves";
        }
    } else if (person == "2") {
        if (number == "s") {
           return "yourself (" + gender + ")";
        } else {
            return "yourselves (" + gender + ")";
        }
    } else if (person == "3") {
        if (number == "s") {
            if (gender == "m") {
                return "himself/itself";
            } else if (gender == "f") {
                return "herself/itself";
            } else {
                return "himself/herself/itself";
            }
        }
    }
    return ""
}

function get_subject_pronoun(person, gender, number) {
    if (person == "1") {
        if (number == "s") {
            return "I";
        } else {
            return "we";
        }
    } else if (person == "2") {
        return "you (" + gender + number + ")";
    } else if (person == "3") {
        return "(" + person + gender + number + ")";
    }
    return ""
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
