let node_strongs_to_english;
if (typeof window === 'undefined') {
    // This is so we can run tests using node.js.
    node_strongs_to_english = require('./strongs-to-english.js')
    strongs_to_english_override = require('./strongs-to-english-override.js')
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
    let strongs = "";
    // There can be more than one Hebrew form.
    // The Strong's number will be surrounded by parentheses.
    for (let i = 5; i < words.length; i++) {
        strongs = words[i];
        if (strongs[0] == '(') {
            strongs = strongs.substring(1, strongs.length - 1);
            break;
        }
    }
    let forms = section2.split(";")
    return conjugate_Hebrew_as_English(transliteration, strongs, forms)
}

function conjugate_Hebrew_as_English(transliteration, strongs, forms) {
    let conjugations = [];
    let unknowns = [];
    let last_form = forms[forms.length - 1];
    let has_suffix = false;
    if (last_form.trim().startsWith("Suffix")) {
        has_suffix = true;
    }
    let word_position = -1;
    // There can only be one word form.
    // It is in the last position unless there is a suffix.
    if (has_suffix) {
        word_position = forms.length - 2;
    } else {
        word_position = forms.length - 1;
    }
    let word_terms = "";
    // Conjugate the forms.
    for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        // Split the form into terms.
        var terms = form.trim().split(/\s+/);
        let word = ""
        if (i == word_position) {
            word_terms = terms;
            result = get_English_for_Strongs(strongs, terms);
            word = result[0];
            terms = result[1];
            if (word == "") {
                word_position = -1;
            }
        }
        let conjugation = "";
        // Branch on the first term.
        if (terms[0] == "Adjective") {
            let gender = "";
            let number = "";
            let construct = "";
            // Process terms.
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "absolute") {
                    // Skip.
                } else if (term == "adjective") {
                    // Skip.
                } else if (term == "both") {
                    // Skip.
                } else if (term == "cardinal") {
                    // Skip.
                } else if (term == "common") {
                    // skip.
                } else if (term == "dual") {
                    number = "p";
                } else if (term == "construct") {
                    if (!has_suffix) {
                        construct = " of";
                    }
                } else if (term == "feminine") {
                    gender = "f";
                } else if (term == "masculine") {
                    gender = "m";
                } else if (term == "number") {
                    // Skip.
                } else if (term == "ordinal") {
                    // Skip.
                } else if (term == "plural") {
                    number = "p";
                } else if (term == "singular") {
                    number = "s";
                } else {
                    unknowns.push(term)
                }
            }
            conjugation = word;
            if (number || gender) {
                conjugation += " (" + gender + number + ")"
            }
            conjugation += construct;
            conjugations.push(conjugation);
        } else if (terms[0] == "Adverb") {
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                unknowns.push(term)
            }
            conjugations.push(word);
        } else if (terms[0] == "Conjunction") {
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                unknowns.push(term)
            }
            if (i == word_position) {
                conjugations.push(word)
            } else {
                // A clitic.
                conjugations.push("and");
            }
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
                    // Skip.
                } else if (term == "dual") {
                    number = "p";
                } else if (term == "construct") {
                    if (!has_suffix) {
                        construct = " of";
                    }
                } else if (term == "feminine") {
                    gender = "f";
                } else if (term == "gentilic") {
                    // Skip.
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
            if (conjugation == "faces" &&
                conjugations.length == 1 && conjugations[0] == "to") {
                // "to faces" is translated as the preposition "before"
                // This is common enough to write special code for it.
                conjugations = ["before"];
                forms[i] = "Preposition";
            } else {
                conjugation += construct;
                conjugations.push(conjugation);
            }
        } else if (terms[0] == "Particle") {
            let conjugation = "";
            if (i == word_position) {
                conjugation = word;
            } else {
                // A clitic.
                for (let j = 1; j < terms.length; j++) {
                    let term = terms[j];
                    if (term == "definite") {
                        // Definite articles are attached.
                        conjugation = "the";
                    } else if (term == "interrogative") {
                        // Definite articles are attached.
                        conjugation = "¿";
                    } else if (term == "relative") {
                        conjugation = "which";
                    }
                }
            }
            if (!conjugation) {
                // An unknown attached particle.
                conjugation = "???";
                unknowns = unknowns.concat(terms);
            }
            conjugations.push(conjugation);
        } else if (terms[0] == "Preposition") {
            if (i == word_position) {
                conjugation = word;
            } else {
                // A clitic.
                preposition = "";
                if (forms[0] == "Conjunction") {
                    // Skip the vav.
                    if (transliteration[0] == "v") {
                        preposition = transliteration.substring(2, 4);
                    } else if (transliteration[0] == "û") {
                        preposition = transliteration.substring(1, 3);
                    } else {
                        unknowns.push(transliteration.substring(0, 2));
                    }
                } else {
                    preposition = transliteration.substring(0, 2);
                }
                if (preposition[0] == "b") {
                    conjugation = "in";
                } else if (preposition[0] == "ḇ") {
                    conjugation = "in";
                } else if (preposition[0] == "l") {
                    conjugation = "to";
                } else if (preposition[0] == "k") {
                    conjugation = "as";
                } else if (preposition[0] == "ḵ") {
                    conjugation = "as";
                } else if (preposition[0] == "m") {
                    conjugation = "from";
                } else {
                    unknowns.push(preposition);
                }
            }
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "article") {
                    // Skip.
                } else if (term == "definite") {
                    // Prepositions can include definite articles.
                    conjugation += " the";
                } else {
                    unknowns.push(term)
                }
            }
            conjugations.push(conjugation);
        } else if (terms[0] == "Pronoun") {
            let gender = "";
            let number = "";
            let person = "";
            // Process terms.
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "common") {
                    // Skip.
                } else if (term == "demonstrative") {
                    // Skip.
                } else if (term == "feminine") {
                    gender = "f";
                } else if (term == "first") {
                    person = "1";
                } else if (term == "masculine") {
                    gender = "m";
                } else if (term == "plural") {
                    number = "p";
                } else if (term == "personal") {
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
            let conjugation;
            if (i == word_position) {
                conjugation = word;
                // Word should already be marked for number.
                if (gender != "") {
                    conjugation += " (" + gender + ")"
                }
            } else {
                // A clitic.
                conjugation = get_subject_pronoun(person, gender, number, false)
            }
            conjugations.push(conjugation)
        } else if (terms[0] == "Suffix") {
            let gender = "";
            let number = "";
            let person = "";
            let voice = "";
            let he = "";
            // Process terms.
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "common") {
                    // Skip.
                } else if (term == "directional") {
                    he = "-ward";
                } else if (term == "feminine") {
                    gender = "f";
                } else if (term == "first") {
                    person = "1";
                } else if (term == "he") {
                    // Skip.
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
            let priorForm = forms[i - 1].trim();
            if (he) {
                // 'He' is a suffix with special meaning.
                conjugation = he;
                conjugations.push(conjugation);
            } else if (priorForm.startsWith("Noun") || priorForm.startsWith("Adjective")) {
                conjugation = get_possessive_pronoun(person, gender, number);
                // Put the conjugation before the noun.
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
            let jussive = false;
            let participle = false;
            let passive = false;
            let reflexive = false;
            let sequential = false;
            // Process terms.
            for (let j = 1; j < terms.length; j++) {
                let term = terms[j];
                if (term == "active") {
                    // Skip.
                } else if (term == "absolute") {
                    // Skip.
                } else if (term == "common") {
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
                } else if (term == "hithpaal") {
                    causative = true;
                } else if (term == "hithpael") {
                    reflexive = true;
                } else if (term == "hithpalel") {
                    reflexive = true;
                } else if (term == "hithpolel") {
                    reflexive = true;
                } else if (term == "imperative") {
                    imperative = true;
                } else if (term == "imperfect") {
                    imperfect = true;
                } else if (term == "infinitive") {
                    infinitive = true;
                } else if (term == "jussive") {
                    jussive = true;
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
                } else if (term == "pilel") {
                    intensive = true;
                } else if (term == "pulal") {
                    intensive = true;
                    passive = true;
                } else if (term == "plural") {
                    number = "p";
                } else if (term == "polel") {
                    intensive = true;
                } else if (term == "polal") {
                    intensive = true;
                    passive = true;
                } else if (term == "polpal") {
                    intensive = true;
                    passive = true;
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
                    sequential = true;
                } else if (term == "singular") {
                    number = "s";
                } else if (term == "third") {
                    person = "3";
                } else {
                    unknowns.push(term)
                }
            }
            if (sequential) {
                // Vav-consecutive changes the aspect.
                imperfect = !imperfect;
            }
            // Generate conjugation.
            let verb = word;
            if (intensive) {
                verb = "really " + verb;
            }
            if (causative) {
                verb = "cause to " + verb;
            }
            // Get participial form.
            if (passive) {
                verb = "be " + get_verb_inflection(verb, "PP")
            }
            if (imperfect) {
                verb = get_verb_inflection(verb, "PC");
            }
            if (reflexive && (person || gender || number)) {
                verb += " " + get_reflexive_pronoun(person, gender, number);
            }
            if (jussive) {
                verb = "let " + verb;
            }
            let conjugation;
            if (participle) {
                conjugation = "that which " + verb;
                if (gender) {
                    conjugation += " (" + gender + ")";
                }
            } else if (jussive || imperative) {
                if (gender || number) {
                    conjugation = "(" + gender + number + ") " + verb;
                }
            } else if (infinitive) {
                conjugation = verb;
            } else {
                conjugation = get_subject_pronoun(person, gender, number, true) + " " + verb;
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
        let unknown_str = "";
        for (let i = 0; i < unknowns.length; i++) {
            if (unknown_str != "") {
                unknown_str += " ";
            }
            unknown_str += unknowns[i];
        }
        let result = get_English_for_Strongs(strongs, word_terms);
        let word = result[0];
        console.log(transliteration, word, "unknowns =", unknown_str)
        if (result == "") {
            result = word;
        }
        result += " (" + unknown_str + ")";
    }
    return result;
}

function get_noun_inflection(word, form) {
    if (form == "PL") {
        if (word == "heaven") {
            return "heavens";
        }
        if (word == "Lord") {
            return word;
        }
        if (word == "them") {
            return word;
        }
        if (word == "these") {
            return word;
        }
        if (word == "water") {
            return "waters";
        }
    }
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
                return "her";
            } else if (gender == "m") {
                return "him";
            } else {
                return "it";
            }
        } else {
            return "them (" + gender + ")";
        }
    }
    console.log("Unknown object pronoun: " + person + gender + number);
    return "???";
}

function get_possessive_pronoun(person, gender, number) {
    if (person == "1") {
        if (number == "s") {
            return "my";
        } else {
            return "our";
        }
    } else if (person == "2") {
        return "your (" + gender + number + ")";
    } else if (person == "3") {
        if (number == "s") {
            if (gender == "f") {
                return "her";
            } else if (gender == "m") {
                return "his";
            } else {
                return "its";
            }
        } else {
            return "their (" + gender + ")";
        }
    }
    console.log("Unknown poss. pronoun: " + person + gender + number);
    return "???";
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
                return "himself";
            } else if (gender == "f") {
                return "herself";
            } else {
                return "itself";
            }
        } else {
            // Gender will be expressed elsewhere.
            return "themselves"
        }
    }
    console.log("Unknown reflexive pronoun: " + person + gender + number);
    return "???"
}

function get_subject_pronoun(person, gender, number, implicit) {
    if (person == "1") {
        if (number == "s") {
            return "I";
        } else {
            return "we";
        }
    } else if (person == "2") {
        return "you (" + gender + number + ")";
    } else if (person == "3") {
        if (implicit) {
            return "(" + person + gender + number + ")";
        } else if (number == "p") {
            if (gender) {
                return "they (" + gender + ")";
            }
            return "they";
        } else if (gender == "m") {
            return "he";
        } else if (gender == "f") {
            return "she";
        } else {
            return "it";
        }
    }
    console.log("Unknown subject pronoun: " + person + gender + number);
    return "???"
}

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
    if (node_strongs_to_english) {
        // This is so we can run tests using node.js.
        return [node_strongs_to_english[strongs], terms]
    } else {
        return [strongs_to_english[strongs], terms]
    }
}

function is_subset(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
        if (!array2.includes(array1[i])) {
            return false
        }
    }
    return true
}

if (typeof window === 'undefined') {
    // This is so we can run tests using node.js.
    module.exports = conjugate;
}
