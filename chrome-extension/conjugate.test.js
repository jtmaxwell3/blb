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
