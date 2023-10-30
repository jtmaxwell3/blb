// This file is for running tests under node.js.
const conjugate = require('./conjugate.js')

function run_test(description, gold) {
    result = conjugate(description);
    console.assert(result == gold, "\"" + result + "\"", "is not", "\"" + gold + "\"")
}

console.log("Running conjugate.test.js.")

// Use back tics to allow carriage returns.
run_test(`Transliteration: bᵊrē'šîṯ
From the root רֵאשִׁית (H7225) - Hebrew: Preposition; Noun common feminine singular absolute
English: In the beginning`, "in beginning (f)")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb qal perfect third person masculine singular
English: created`, "(3msg) create")

run_test(`Transliteration: 'ēṯ
From the root אֵת (H853) - Hebrew: Particle direct object marker`, "(dobj)")

run_test(`Transliteration: vᵊ'ēṯ
From the root אֵת (H853) - Hebrew: Conjunction; Particle direct object marker
English: and`, "and (dobj)")

run_test(`Transliteration: haššāmayim
From the root שָׁמַיִם (H8064) - Hebrew: Particle definite article; Noun common masculine plural absolute
English: the heavens`, "the heavens (m)")

run_test(`Transliteration: ʿal
From the root עַל (H5921) - Hebrew: Preposition
English: was over`, "on")

run_test(`Transliteration: bᵊṯôḵ
From the root תָּוֶךְ (H8432) - Hebrew: Preposition; Noun common masculine singular construct
English: in the midst`, id="in midst (m) of")

run_test(`Transliteration: ûḵḇôḏô
From the root כָּבוֹד (H3519) - Hebrew: Conjunction; Noun common both singular construct; Suffix pronominal third person masculine singular
English: And His glory`, "and his/its glory of")

run_test(`Transliteration: 'ôrēḵ
From the root אוֹר (H216) - Hebrew: Noun common both singular construct; Suffix pronominal second person feminine singular
English: your light`, "your (fsg) light of")
