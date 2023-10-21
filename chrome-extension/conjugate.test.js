// This file is for running tests under node.js.
const conjugate = require('./conjugate.js')

function run_test(description, gold) {
    result = conjugate(description);
    console.assert(result == gold, result, "is not", gold)
}

console.log("Running conjugate.test.js.")
run_test(`Transliteration: bᵊrē'šîṯ
From the root רֵאשִׁית (H7225) - Hebrew: Preposition; Noun common feminine singular absolute
English: In the beginning`, "beginning")
