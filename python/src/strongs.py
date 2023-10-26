import json
import os
import re

import nltk
from nltk.stem import WordNetLemmatizer

nltk.download('wordnet')

strongs_to_english_override = {
    "H853": "(dobj)"
}


def create_strongs_to_english():
    """Create a dictionary from strong's numbers to english."""
    filename = '../../../strongs/hebrew/strongs-hebrew-dictionary.json'
    hebrew_translations = get_strongs_dict_translations(filename)
    # hebrew_translation = choose_least_shared_translations(hebrew_translations)
    hebrew_translation = choose_most_frequent_translations(hebrew_translations)
    hebrew_translation.update(strongs_to_english_override)
    filename = 'strongs-to-english.js'
    file = open('strongs-to-english.js', 'w')
    file.write('var strongs_to_english = ' + str(hebrew_translation) +
               '\n\nif (typeof window === \'undefined\') {\n    module.exports = strongs_to_english;\n}')
    file.close()
    print('wrote', filename)


def choose_most_frequent_translations(translations):
    translation = dict()
    lemmatizer = WordNetLemmatizer()
    strongs_to_phrases = create_strongs_to_phrases(lemmatizer)
    for source in translations:
        targets = translations[source]
        if len(targets) == 1:
            translation[source] = targets[0]
            continue
        frequency = dict()
        if source not in strongs_to_phrases:
            print('no phrases for', source, 'cannot disambiguate', targets)
            translation[source] = targets[0]
            continue
        phrases = strongs_to_phrases[source]
        for phrase in phrases:
            target = get_target_for_phrase(phrase, targets, lemmatizer)
            if not target:
                continue
            if target not in frequency:
                frequency[target] = 0
            frequency[target] += 1
        best_target = None
        best_frequency = 0
        for target in frequency:
            if frequency[target] > best_frequency:
                best_target = target
                best_frequency = frequency[target]
        if not best_target:
            best_target = targets[0]
        translation[source] = best_target
    return translation


def get_target_for_phrase(phrase, targets, lemmatizer, debug=False):
    best_target = None
    best_lemma = None
    for target in targets:
        lemma = lemmatize_text(target, lemmatizer)
        pos = phrase.find(lemma)
        if pos != -1:
            end = pos + len(lemma)
            if end < len(phrase) and phrase[end].isalnum():
                continue
            if best_target is None:
                best_target = target
                best_lemma = lemma
            elif lemma.find(best_lemma) != -1:
                # target contains best_target.
                best_target = target
            elif best_lemma.find(lemma) != -1:
                # best_target contains target.
                pass
            elif debug:
                print('both', lemma, 'and', best_lemma, 'appear in', "'" + phrase + "'")
    if best_target is None:
        if debug:
            print('Could not find', targets, 'in', "'" + phrase + "'")
    return best_target


def create_strongs_to_phrases(lemmatizer=None):
    directory = '../../../interlinear_bible'
    dictionary = dict()
    if not lemmatizer:
        lemmatizer = WordNetLemmatizer()
    for filename in os.listdir(directory):
        fullname = os.path.join(directory, filename)
        print('Reading', fullname)
        with open(fullname, 'r') as file:
            book = json.load(file)
            for verse in book:
                for word in verse['verse']:
                    strongs = word['number']
                    strongs = strongs[0].upper() + strongs[1:]
                    if strongs not in dictionary:
                        dictionary[strongs] = list()
                    text = word['text']
                    if text:
                        lemmatized_text = lemmatize_text(text, lemmatizer)
                        # print(text, '=>', lemmatized_text)
                        dictionary[strongs].append(lemmatized_text)
    return dictionary


def lemmatize_text(text, lemmatizer):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    new_text = ''
    for word in text.split(' '):
        if new_text:
            new_text += ' '
        if len(word) < 3:
            new_text += word
            continue
        noun = lemmatizer.lemmatize(word, 'n')
        verb = lemmatizer.lemmatize(word, 'v')
        if verb != word:
            word = verb
        elif noun != word and not (word[-1] == 's' and word[-2] == 's'):
            word = noun
        elif word.endswith('eth'):
            for suffix_length in [2, 3]:
                word2 = word[0:-suffix_length]
                if len(word2) > 2 and word2[-1] == word2[-2]:
                    word2 = word2[0:-1]
                word2 += 's'
                verb = lemmatizer.lemmatize(word2, 'v')
                if verb != word2:
                    word = verb
                    break
        new_text += word
    return new_text


def choose_least_shared_translations(translations):
    """Choose a representative translation for each source word."""
    # Map targets to their sources.
    target_to_sources = invert_translations(translations)
    # Pick the least shared translation.
    translation = dict()
    for source in translations:
        best_target = None
        best_count = 10000
        for target in translations[source]:
            if len(target_to_sources[target]) < best_count:
                best_target = target
                best_count = len(target_to_sources[target])
        translation[source] = best_target
    for source in translation:
        print(source, '=>', translation[source])
    print_shared_translations(translation, translations)
    return translation


def print_shared_translations(translation, translations):
    """Print the translations that are shared by multiple source terms."""
    target_to_sources = invert_translations(translation)
    shared = 0
    for target in target_to_sources:
        sources = target_to_sources[target]
        if len(sources) > 1:
            print(target, 'appears in', sources)
            for source in sources:
                targets = translations[source]
                print('  ', source, '=>', targets)
            shared += 1
    print('There were', shared, 'shared translations.')


def invert_translations(translations):
    """Create target to sources from source to targets."""
    target_to_sources = dict()
    for source in translations:
        targets = translations[source]
        if not isinstance(targets, list):
            targets = [targets]
        for target in targets:
            if target not in target_to_sources:
                target_to_sources[target] = list()
            target_to_sources[target].append(source)
    return target_to_sources


def get_strongs_dict_translations(filename):
    """Get the translations from open scripture data."""
    with open(filename, 'r') as file:
        dictionary = json.load(file)
    translations = dict()
    for source in dictionary:
        entry = dictionary[source]
        targets = get_entry_translations(entry)
        translations[source] = targets
    return translations


def get_entry_translations(entry):
    """Get the translations from an open scripture entry."""
    translations = None
    if 'kjv_def' in entry:
        translations = parse_kjv_def(entry['kjv_def'])
    if not translations:
        translations = parse_kjv_def(entry['strongs_def'])
    if len(translations) == 0:
        print('ERROR no entries for', entry)
    return translations


def parse_kjv_def(text):
    """Parse the kjv_def field of an open scripture entry."""
    orig_text = text
    # Remove parenthetical.
    while True:
        begin = text.find('(')
        end = text.find(')')
        begin2 = text.find('(', begin + 1)
        if 0 < begin2 < end:
            end = text.find(')', end + 1)
        if begin < 0 or end < 0 or end < begin:
            break
        if text[begin + 1] == '-' and text[begin - 1] not in (' ', ','):
            prior_comma = text.rfind(',', 0, begin)
            next_comma = text.find(',', begin)
            if next_comma == -1:
                next_comma = len(text)
            next_begin = text.find('(', end)
            if next_begin == -1:
                next_begin = len(text)
            if next_comma < end or next_begin < next_comma:
                text = text[0:begin] + text[end + 1:]
            else:
                prior_text = text[0:prior_comma + 1]
                alt1 = text[prior_comma + 1:begin]
                alt2 = combine_morphemes(text[prior_comma + 1:begin], text[begin + 2:end])
                next_text = text[next_comma:]
                orig_text = text
                text = prior_text + alt1 + ', ' + alt2 + next_text
                print("converted", orig_text, "to\n         ", text)
        else:
            text = text[0:begin] + text[end + 1:]
    while True:
        begin = text.find('[')
        end = text.find(']')
        if begin < 0 or end < 0 or end < begin:
            break
        text = text[0:begin] + text[end + 1:]
    period = text.find('. ')
    if period > 0:
        text = text[0:period]
    items = text.split(', ')
    new_items = list()
    for item in items:
        item = item.replace('.', '')
        item = item.replace('  ', ' ')
        item = item.strip()
        if not item:
            # print('WARNING: empty item in ', orig_text)
            continue
        new_items.append(item.strip())
    return new_items


def combine_morphemes(stem, suffix):
    if stem[-1] == 'y' and suffix[0] == 'i':
        return stem[:-1] + suffix
    return stem + suffix


if __name__ == '__main__':
    # create_strongs_to_phrases()
    create_strongs_to_english()
