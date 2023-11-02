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
English: And His glory`, "and his/its glory")

run_test(`Transliteration: 'ôrēḵ
From the root אוֹר (H216) - Hebrew: Noun common both singular construct; Suffix pronominal second person feminine singular
English: your light`, "your (fs) light")

run_test(`Transliteration: ʿālāy
From the root עַל (H5921) - Hebrew: Preposition; Suffix pronominal first person common singular
English: is upon me`, "on me")

run_test(`Transliteration: vᵊla'ăsûrîm
From the root אָסַר (H631) - Hebrew: Conjunction; Preposition; Verb qal participle passive masculine plural absolute
English: ↓`, "and to bounds (m)")

run_test(`Transliteration: ʿănāvîm
From the root עָנָו (H6035) - Hebrew: Adjective adjective masculine plural absolute
English: to the afflicted`, "meek (mp)")

run_test(`Transliteration: ḵā'āreṣ
From the root אֶרֶץ (H776) - Hebrew: Preposition definite article; Noun common both singular absolute
English: as the earth`, "as the land")

run_test(`Transliteration: ûḵḡannâ
From the root גַּנָּה (H1593) - Hebrew: Conjunction; Preposition; Noun common feminine singular absolute
English: And as a garden`, "and as garden (f)")

run_test(`Transliteration: hēm
From the root הֵם (H1992) - Hebrew: Pronoun personal third person masculine plural
English: they`, "they (m)")

run_test(`Transliteration: lāḵēn
From the root כֵּן (H3651) - Hebrew: Preposition; Adverb
English: Therefore`, "to as")

run_test(`Transliteration: ûḇiḵḇôḏām
From the root כָּבוֹד (H3519) - Hebrew: Conjunction; Preposition; Noun common both singular construct; Suffix pronominal third person masculine plural
English: And in their riches`, "and in their (m) glory")

run_test(`Transliteration: lō'
From the root לֹא (H3808) - Hebrew: Particle negative
English: not`, "not")

run_test(`Transliteration: ḵᵊ'eḥāḏ
From the root אֶחָד (H259) - Hebrew: Preposition; Adjective cardinal number masculine singular absolute
English: together`, "as one (ms)")

run_test(`Transliteration: šāmmâ
From the root שָׁם (H8033) - Hebrew: Adverb; Suffix directional he
English: there`, "there")

run_test(`Transliteration: kāzō'ṯ
From the root זֹאת (H2063) - Hebrew: Preposition; Pronoun demonstrative  feminine singular
English: such a thing`, "???")

run_test(`Transliteration: lāhem - Hebrew: Preposition; Suffix pronominal third person masculine plural
English: theirs`, "to them (m)")
