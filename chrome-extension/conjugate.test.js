// This file is for running tests under node.js.
const conjugate = require('./conjugate.js')

function run_test(description, gold) {
    result = conjugate.conjugate(description);
    console.assert(result == gold, "\"" + result + "\"", "is not", "\"" + gold + "\"")
}

console.log("Running conjugate.test.js.")

// Use back tics to allow carriage returns.
run_test(`Transliteration: eimi
From the root εἰμί (G1510)
Verb - Present Active Indicative - 1st Person Singular
English: am`, "[1s] am")

run_test(`Transliteration: ēleēthēn
From the root ἐλεέω (G1653)
Verb - Aorist Passive Indicative - 1st Person Singular
English: I was shown mercy`, "[1s] was shown mercy")

run_test(`Transliteration: exetrapēsan
From the root ἐκτρέπω (G1624)
Verb - Aorist Passive Indicative - 3rd Person Plural
English: have turned aside`, "[3p] were turned aside")

run_test(`Transliteration: ēn
From the root εἰμί (G1510)
Verb - Imperfect Active Indicative - 3rd Person Singular
English: was`, "[3s] was")

run_test(`Transliteration: eidōs
From the root εἴδω (G1492)
Verb - Perfect Active Participle - Nominative Singular Masculine
English: realizing`, "[3s] knowing [m]")

run_test(`Transliteration: biblos
From the root βίβλος (G976)
Noun - Nominative Singular Feminine
English: The record`, "book [f]")

run_test(`Transliteration: hēmōn
From the root ἐγώ (G1473)
Personal / Possessive Pronoun - Genitive Plural
English: our`, "our");

run_test(`Transliteration: haššāmayim
From the root שָׁמַיִם (H8064) - Hebrew: Particle definite article; Noun common masculine plural absolute
English: the heavens`, "the heavens [m]")

run_test(`Transliteration: bᵊrē'šîṯ
From the root רֵאשִׁית (H7225) - Hebrew: Preposition; Noun common feminine singular absolute
English: In the beginning`, "in beginning [f]")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb qal perfect third person masculine singular
English: created`, "[3ms] create")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb niphal perfect third person masculine singular
English: created`, "[3ms] be created")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb piel perfect third person masculine singular
English: created`, "[3ms] really create")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb pual perfect third person masculine singular
English: created`, "[3ms] be really created")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hithpael perfect third person masculine singular
English: created`, "[3ms] create himself")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hiphil perfect third person masculine singular
English: created`, "[3ms] cause to create")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hophal perfect third person masculine singular
English: created`, "[3ms] be caused to create")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb qal imperfect third person masculine singular
English: created`, "[3ms] creating")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb niphal imperfect third person masculine singular
English: created`, "[3ms] being created")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb piel imperfect third person masculine singular
English: created`, "[3ms] really creating")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb pual imperfect third person masculine singular
English: created`, "[3ms] being really created")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hithpael imperfect third person masculine singular
English: created`, "[3ms] creating himself")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hiphil imperfect third person masculine singular
English: created`, "[3ms] causing to create")

run_test(`Transliteration: bārā'
From the root בָּרָא (H1254) - Hebrew: Verb hophal imperfect third person masculine singular
English: created`, "[3ms] being caused to create")

run_test(`Transliteration: 'ēṯ
From the root אֵת (H853) - Hebrew: Particle direct object marker`, "[dobj]")

run_test(`Transliteration: vᵊ'ēṯ
From the root אֵת (H853) - Hebrew: Conjunction; Particle direct object marker
English: and`, "and [dobj]")

run_test(`Transliteration: mᵊ'ōrōṯ
From the root מָאוֹר (H3974) - Hebrew: Noun common masculine plural absolute
English: lights`, "lights [m]")

run_test(`Transliteration: ʿal
From the root עַל (H5921) - Hebrew: Preposition
English: was over`, "upon")

run_test(`Transliteration: bᵊṯôḵ
From the root תָּוֶךְ (H8432) - Hebrew: Preposition; Noun common masculine singular construct
English: in the midst`, id="in midst [m] of")

run_test(`Transliteration: ûḵḇôḏô
From the root כָּבוֹד (H3519) - Hebrew: Conjunction; Noun common both singular construct; Suffix pronominal third person masculine singular
English: And His glory`, "and his glory")

run_test(`Transliteration: 'ôrēḵ
From the root אוֹר (H216) - Hebrew: Noun common both singular construct; Suffix pronominal second person feminine singular
English: your light`, "your [fs] light")

run_test(`Transliteration: ʿālāy
From the root עַל (H5921) - Hebrew: Preposition; Suffix pronominal first person common singular
English: is upon me`, "upon me")

run_test(`Transliteration: vᵊla'ăsûrîm
From the root אָסַר (H631) - Hebrew: Conjunction; Preposition; Verb qal participle passive masculine plural absolute
English: ↓`, "and to that which be bound [mp]")

run_test(`Transliteration: ʿănāvîm
From the root עָנָו (H6035) - Hebrew: Adjective adjective masculine plural absolute
English: to the afflicted`, "poor [mp]")

run_test(`Transliteration: ḵā'āreṣ
From the root אֶרֶץ (H776) - Hebrew: Preposition definite article; Noun common both singular absolute
English: as the earth`, "as the land")

run_test(`Transliteration: ûḵḡannâ
From the root גַּנָּה (H1593) - Hebrew: Conjunction; Preposition; Noun common feminine singular absolute
English: And as a garden`, "and as garden [f]")

run_test(`Transliteration: hēm
From the root הֵם (H1992) - Hebrew: Pronoun personal third person masculine plural
English: they`, "they [m]")

run_test(`Transliteration: lāḵēn
From the root כֵּן (H3651) - Hebrew: Preposition; Adverb
English: Therefore`, "to so")

run_test(`Transliteration: ûḇiḵḇôḏām
From the root כָּבוֹד (H3519) - Hebrew: Conjunction; Preposition; Noun common both singular construct; Suffix pronominal third person masculine plural
English: And in their riches`, "and in their [m] glory")

run_test(`Transliteration: lō'
From the root לֹא (H3808) - Hebrew: Particle negative
English: not`, "not")

run_test(`Transliteration: ḵᵊ'eḥāḏ
From the root אֶחָד (H259) - Hebrew: Preposition; Adjective cardinal number masculine singular absolute
English: together`, "as one [ms]")

run_test(`Transliteration: šāmmâ
From the root שָׁם (H8033) - Hebrew: Adverb; Suffix directional he
English: there`, "there -ward")

run_test(`Transliteration: kāzō'ṯ
From the root זֹאת (H2063) - Hebrew: Preposition; Pronoun demonstrative  feminine singular
English: such a thing`, "as this [f]")

run_test(`Transliteration: lāhem - Hebrew: Preposition; Suffix pronominal third person masculine plural
English: theirs`, "to them [m]")

run_test(`Transliteration: 'ōhēḇ
From the root אָהַב (H157) - Hebrew: Verb qal participle active masculine singular absolute
English: love`, "that which love [ms]")

run_test(`Transliteration: kî
From the root כִּי (H3588) - Hebrew: Conjunction
English: that`, "that")

run_test(`Transliteration: mēʿal
From the root עַל (H5921) - Hebrew: Preposition; Preposition
English: were above`, "from upon")

run_test(`Transliteration: šᵊnāṯayim
From the root שָׁנָה (H8141) - Hebrew: Noun common feminine dual absolute
English: two years`, "two years [f]")

run_test(`Transliteration: lᵊhiṯyaṣṣēḇ
From the root יָצַב (H3320) - Hebrew: Preposition; Verb hithpael infinitive construct
English: to present themselves`, "to stand of")

run_test(`Transliteration: 'ănaḥnû
From the root אֲנַחְנוּ (H587) - Hebrew: Pronoun personal first person common plural
English: we`, "we")

run_test(`Transliteration: ṣāp̄naṯ
From the root צָֽפְנַת פַּעְנֵחַ (H6847) - Hebrew: Noun proper name
English: Zaphenath-paneah`, "Zaphenath-paneah")

run_test(`Transliteration: lᵊp̄ānāyv
From the root פָּנִים (H6440) - Hebrew: Preposition; Noun common both plural construct; Suffix pronominal third person masculine singular
English: before Him`, "before him")

run_test(`Transliteration: lip̄nê
From the root פָּנִים (H6440) - Hebrew: Preposition; Noun common both plural construct
English: before`, "before")

run_test(`Transliteration: šehāyâ
From the root הָיָה (H1961) - Hebrew: Particle relative; Verb qal perfect third person masculine singular
English: to being`, "which [3ms] be")

run_test(`Transliteration: hammazkirîm
From the root זָכַר (H2142) - Hebrew: Particle definite article; Verb hiphil participle active masculine plural absolute
English: You who remind`, "the that which cause to remember [mp]")

run_test(`Transliteration: vᵊhā'ălāp̄îm
From the root אֶלֶף (H504) - Hebrew: Conjunction; Particle definite article; Noun common masculine plural absolute
English: Also the oxen`, "and the cattle [m]")

run_test(`title="Transliteration: vᵊ'umlal
From the root אָמַל (H535) - Hebrew: Conjunction; Verb pulal sequential perfect third person masculine singular
English: And languishes`, "and [3ms] being really weakened")

run_test(`Transliteration: vᵊyiṯbārḵû
From the root בָּרַךְ (H1288) - Hebrew: Conjunction; Verb hithpael imperfect third person masculine plural
English: And let bless themselves`, "and [3mp] blessing themselves")

run_test(`Transliteration: bᵊḥîrî
From the root בָּחִיר (H972) - Hebrew: Adjective adjective masculine singular construct; Suffix pronominal first person common singular
English: My chosen one`, "my chosen [ms]")

run_test(`Transliteration: ûḵhiṯpallēl
From the root פָּלַל (H6419) - Hebrew: Conjunction; Preposition; Verb hithpael infinitive construct
English: Now while was praying`, "and as pray of")

run_test(`Transliteration: bᵊṣurôṯ
From the root בָּצַר (H1219) - Hebrew: Adjective adjective feminine plural absolute
English: fortified`, "fortified [fp]")

run_test(`Transliteration: ṯiḇṣōr
From the root בָּצַר (H1219) - Hebrew: Verb qal imperfect second person masculine singular
English: you shall gather`, "you [ms] gathering")

run_test(`Transliteration: ḡā'ô
From the root גָּאָה (H1342) - Hebrew: Verb qal infinitive absolute
English: highly`, "to rise up")

run_test(`Transliteration: lî
From the root אֲנִי (H589) - Hebrew: Preposition; Suffix pronominal first person common singular
English: to Me`, "to me")

run_test(`Transliteration: tᵊhillōṯ
From the root תְּהִלָּה (H8416) - Hebrew: Noun common feminine plural construct
English: the praises`, "praises [f] of")

run_test(`Transliteration: ya'ăriḵûn
From the root אָרַךְ (H748) - Hebrew: Verb hiphil imperfect third person masculine plural; Suffix paragogic nun
English: may be prolonged`, "[3mp] causing to be long")

run_test(`Transliteration: ḥyשh
From the root חִישׁ (H2439) - Hebrew: Verb qal imperative second person masculine singular; Suffix paragogic he
English: hasten`, "[ms] make haste!")

run_test(`Transliteration: kullānû
From the root כֹּל (H3605) - Hebrew: Noun common masculine singular construct; Suffix pronominal first person common plural
English: all of us`, "all [m] of us")

run_test(`Transliteration: miṯʿôrēr
From the root עוּר (H5782) - Hebrew: Verb hithpolel participle active masculine singular absolute
English: Who arouses himself`, "that which rouse himself [ms]")

run_test(`Transliteration: lᵊhiṯyaḥēś
From the root יָחַשׂ (H3187) - Hebrew: Preposition; Verb hithpael infinitive construct
English: he is enrolled in the genealogy`, "to enroll of")

run_test(`Transliteration: malkā'
From the root מֶלֶךְ (H4430) - Aramaic: Noun common masculine singular determined; Particle definite article
English: The king`, "the king [m]")

run_test(`Transliteration: ûp̄išrā'
From the root פְּשַׁר (H6591) - Aramaic: Conjunction; Noun common masculine singular determined; Particle definite article
English: and the interpretation`, "and the interpretation [m]")

run_test(`Transliteration: lᵊḵōl
From the root כֹּל (H3606) - Aramaic: Particle direct object marker; Noun common masculine singular construct
English: all`, "[dobj] all [m] of")

run_test(`Transliteration: mipnêhem
From the root פָּנִים (H6440) - Hebrew: Preposition; Noun common both plural construct; Suffix pronominal third person masculine plural
English: before them`, "before them [m]")

