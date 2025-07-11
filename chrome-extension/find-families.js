const conjugate = require('./conjugate.js')
const strongs_greek_dictionary = require('../../strongs/greek/strongs-greek-dictionary.json')

function find_families() {
    let root_dict = {};
    let branches_dict = {}
    let family_dict = {}
    for (let strongs in strongs_greek_dictionary) {
        let root = get_root(strongs_greek_dictionary[strongs]);
        if (root == null) continue;
        result = conjugate.get_English_for_Strongs(strongs, []);
        strongs = strongs  + ":" + result[0];
        result = conjugate.get_English_for_Strongs(root, []);
        root = root + ":" + result[0];
        root_dict[strongs] = root;
        if (!(root in branches_dict)) {
            branches_dict[root] = [];
        }
        branches_dict[root].push(strongs);
    }
    for (let strongs in root_dict) {
        root = root_dict[strongs];
        if (!(root in root_dict)) {
            family_dict[root] = get_family(root, branches_dict);
        }
    }
    console.log(family_dict);
}

function get_family(root, branches_dict) {
    if (!(root in branches_dict)) {
        return [];
    }
    let family = [ ];
    for (var i = 0; i < branches_dict[root].length; i++) {
        var branch = branches_dict[root][i];
        family.push(branch);
        family = family.concat(get_family(branch, branches_dict));
    }
    return family;
}

function get_root(entry) {
    if (!("derivation" in entry)) return null;
    let derivation = entry["derivation"];
    if (derivation.indexOf(" and ") > 0) return null;
    let root = null;
    let end = 0;
    while (true) {
        // Get the next strongs number.
        let start = derivation.indexOf("G", end);
        if (start == -1) break;
        if (start > 0 && derivation[start - 1] != " ") {
            end = start + 1;
            continue;
        }
        end = derivation.indexOf(" ", start);
        if (end == -1) break;
        if (root != null) {
            // Ignore entries with multiple roots.
            return null;
        }
        if (start < 5) return null;
        var prefix = derivation.substring(start - 5, start);
        if (prefix != "from ") return null;
        root = derivation.substr(start, end - start);
    }
    return root;
}

find_families();
