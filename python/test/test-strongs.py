import unittest
from nltk.stem import WordNetLemmatizer

from strongs import lemmatize_text, combine_phrases, parse_kjv_def, normalize_TBESH_translation


class Test(unittest.TestCase):

    def test_lemmatize_text(self):

        def run_test(test, gold):
            result = lemmatize_text(test)
            self.assertEqual(gold, result)

        # run_test('saw', 'see')
        # run_test('beginning', 'beginning')
        # run_test('evening', 'evening')
        # run_test('hath', 'have')
        # run_test('seeth', 'see')
        run_test('was', 'be')
        run_test('were', 'be')
        run_test('called', 'call')
        run_test('creepeth', 'creep')
        run_test('crieth', 'cry')
        run_test('heavens', 'heaven')
        run_test('made', 'make')
        run_test('moved', 'move')
        run_test('moveth', 'move')
        run_test('pass', 'pass')
        run_test('sheddeth', 'shed')
        run_test('sheweth', 'shew')
        run_test('stumbling-block', 'stumblingblock')
        run_test('men', 'man')
        run_test('women', 'woman')

    def test_combine_phrases(self):

        def run_test(test1, test2, gold):
            result = combine_phrases(test1, test2)
            self.assertEqual(gold, result)

        run_test('a', 'b', 'a b')
        run_test('a-', 'b', 'ab')
        run_test('a', '-b', 'ab')
        run_test('a-', '-b', 'ab')
        run_test('try', '-ies', 'tries')
        run_test('flee', '-ing', 'fleeing')

    def test_parse_kjv_entry(self):

        def run_test(test, gold):
            result = parse_kjv_def(test)
            self.assertEqual(gold, result)

        run_test("fenced (city, fort, munition, strong hold.",
                 ["fenced", "fenced city", "fenced fort", "fenced munition", "fenced strong hold"])
        gold = ["father", "fatherless", "forefather", "forefatherless"]
        run_test("(fore-) father(-less)", gold)
        run_test("fire, light. See also H224 (אוּרִים).", ["fire", "light"])
        run_test("mourn(-er, -ing).", ["mourn", "mourner", "mourning"])
        run_test("mighty (one)", ["mighty", "mighty one"])
        run_test("(dwelling) (place)", ["place", "dwelling", "dwelling place"])
        run_test("great(-ly, -ness, number)",
                 ["great", "greatly", "greatness", "great number"])
        run_test("nine ([phrase] -teen, [phrase] -teenth, -th).",
                 ["nine", "nineteen", "nineteenth", "ninth"])
        run_test(" Haakashtari (includ. the article).", ["Haakashtari"])
        # run_test("dwelling((-) place)", ["dwell", "dwelling place", "dwelling-place"])


    def test_normalize_TBESH_translation(self):

        def run_test(test, gold):
            result = normalize_TBESH_translation(test)
            self.assertEqual(gold, result)

        run_test("a b|c", "(a b|c)")
        run_test("a b/c", "a (b|c)")
        run_test("a b\\c", "a (b|c)")
        run_test("a b/c d", "a (b|c) d")
        run_test("a b\\c d", "a (b|c) d")
        run_test("b/c d", "(b|c) d")
        run_test("b\\c d", "(b|c) d")
        run_test("be luxuriant|to empty", "(be luxuriant|empty)")
        run_test("to draw (up/out)", "draw (up|out)")
        run_test("Hodiah [fem]", "Hodiah")
        run_test("to bore|to play flute|to profane/begin", "(bore|play flute|profane|begin)")
        run_test('ointment pot/seasoning', '(ointment pot|seasoning)')
