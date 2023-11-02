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
English: created`, "(3ms) create")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb niphal perfect third person masculine singular
English: created`, "(3ms) be created")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb piel perfect third person masculine singular
English: created`, "(3ms) really create")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb pual perfect third person masculine singular
English: created`, "(3ms) be really created")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hithpael perfect third person masculine singular
English: created`, "(3ms) create himself/itself")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hiphil perfect third person masculine singular
English: created`, "(3ms) cause to create")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hophal perfect third person masculine singular
English: created`, "(3ms) be caused to create")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb qal imperfect third person masculine singular
English: created`, "(3ms) creating")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb niphal imperfect third person masculine singular
English: created`, "(3ms) being created")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb piel imperfect third person masculine singular
English: created`, "(3ms) really creating")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb pual imperfect third person masculine singular
English: created`, "(3ms) being really created")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hithpael imperfect third person masculine singular
English: created`, "(3ms) creating himself/itself")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hiphil imperfect third person masculine singular
English: created`, "(3ms) causing to create")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hophal imperfect third person masculine singular
English: created`, "(3ms) being caused to create")

run_test(`Transliteration: 'ēṯ
From the root אֵת (H853) - Hebrew: Particle direct object marker`, "(dobj)")

run_test(`Transliteration: vᵊ'ēṯ
From the root אֵת (H853) - Hebrew: Conjunction; Particle direct object marker
English: and`, "and (dobj)")

run_test(`Transliteration: haššāmayim
From the root שָׁמַיִם (H8064) - Hebrew: Particle definite article; Noun common masculine plural absolute
English: the heavens`, "the heavens (m)")

run_test(`Transliteration: mᵊ'ōrōṯ
From the root מָאוֹר (H3974) - Hebrew: Noun common masculine plural absolute
English: lights`, "lights (m)")

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
English: your light`, "your (fs) light of")

run_test(`Transliteration: ʿālāy
From the root עַל (H5921) - Hebrew: Preposition; Suffix pronominal first person common singular
English: is upon me`, "on me")

run_test(`Transliteration: vᵊla'ăsûrîm
From the root אָסַר (H631) - Hebrew: Conjunction; Preposition; Verb qal participle passive masculine plural absolute
English: ↓`, "and to bounds (m)")
