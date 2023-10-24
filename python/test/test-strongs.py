import unittest
from nltk.stem import WordNetLemmatizer

from strongs import lemmatize_text


class Test(unittest.TestCase):

    def test_lemmatize_text(self):

        def run_test(test, gold):
            result = lemmatize_text(test, lemmatizer)
            self.assertEqual(gold, result)

        lemmatizer = WordNetLemmatizer()

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

