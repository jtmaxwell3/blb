import csv
import json
import os
import re

import nltk
from nltk.stem import WordNetLemmatizer

nltk.download('wordnet')
lemmatizer = WordNetLemmatizer()


def create_strongs_to_english():
    datafilename = '../../../Hebrew_lexicon/_data/TBESH_lang.csv'
    hebrew_translation = dict()
    with open(datafilename, mode='r') as file:
        csv_file = csv.reader(file)
        for line in csv_file:
            if line == ['strongNumber', 'etymDesc', 'heading', 'entrycontent']:
                continue
            strongs = 'H' + str(line[0])
            translation = get_first_TBESH_translation(line[2])
            hebrew_translation[strongs] = translation
    write_strongs_to_english(hebrew_translation, 'strongs-to-english.js')


def normalize_TBESH_translation(translation):
    # Remove 'to'.
    if translation.startswith('to '):
        translation = translation[3:]
    # Remove punctuation.
    if translation and translation[-1] in ['!', '?']:
        translation = translation[0:-1]
    # Remove bracketed material.
    while True:
        pos = translation.find('[')
        if pos == -1:
            break
        pos2 = translation.find(']', pos + 1)
        translation = translation[0:pos] + translation[pos2 + 1:]
    # Remove extra space.
    translation = translation.replace('  ', ' ')
    # Add parenthesis around slashes.
    pos = translation.find('/')
    if pos > 0:
        translation = add_parentheses(translation, pos)
        translation = translation.replace('/', '|')
        return translation
    pos = translation.find('\\')
    if pos > 0:
        translation = add_parentheses(translation, pos)
        translation = translation.replace('\\', '|')
        return translation
    pos = translation.find('|')
    if pos > 0:
        return '(' + translation + ')'
    return translation


def add_parentheses(translation, pos):
    pos2 = pos
    while pos > 0 and translation[pos - 1] != ' ':
        pos += -1
    while pos2 < len(translation) and translation[pos2] != ' ':
        pos2 += 1
    return translation[0:pos] + '(' + translation[pos:pos2] + ')' + translation[pos2:]


def get_first_TBESH_translation(translation):
    for char in ['|', '\\', '/', '(', '[']:
        pos = translation.find(char)
        if pos > 0:
            translation = translation[0:pos]
    translation = translation.strip()
    if translation.startswith('to '):
        translation = translation[3:]
    if translation and translation[-1] in ['!', '?']:
        translation = translation[0:-1]
    return translation

def old_create_strongs_to_english():
    """Create a dictionary from strong's numbers to english."""
    filename = '../../../strongs/hebrew/strongs-hebrew-dictionary.json'
    hebrew_translations = get_strongs_dict_translations(filename)
    # hebrew_translation = choose_least_shared_translations(hebrew_translations)
    hebrew_translation = choose_most_frequent_translations(hebrew_translations)
    write_strongs_to_english(hebrew_translation, 'strongs-to-english.js')


def write_strongs_to_english(translation, filename):
    file = open('strongs-to-english.js', 'w')
    # Format hebrew_translation so that each key-value pair is on a separate line.
    ht_str = ",\n".join(": ".join(('"' + k + '"', '"' + str(v) + '"')) for k, v in translation.items())
    file.write('var strongs_to_english = {\n' + ht_str + '\n};\n\n' +
               'if (typeof window === \'undefined\') {\n    module.exports = strongs_to_english;\n}')
    file.close()
    print('wrote', filename)


def choose_most_frequent_translations(translations):
    translation = dict()
    strongs_to_phrases = create_strongs_to_phrases()
    data = list()
    debug_source = "H4036"
    for source in translations:
        targets = translations[source]
        if source == debug_source:
            print(source, 'targets:', targets)
        if len(targets) == 1:
            translation[source] = targets[0]
            continue
        frequency = dict()
        if source not in strongs_to_phrases:
            print('no phrases for', source, 'cannot disambiguate', targets)
            translation[source] = targets[0]
            continue
        phrases = strongs_to_phrases[source]
        if source == debug_source:
            print(source, 'has', len(phrases), 'phrases')
        for phrase in phrases:
            target = get_target_for_phrase(phrase, targets, source == debug_source)
            if source == debug_source:
                print("'" + str(target) + "'", 'is target for', "'" + phrase + "'")
            if not target:
                continue
            if target not in frequency:
                frequency[target] = 0
            frequency[target] += 1
        if source == debug_source:
            print('frequency', frequency)
        best_target = None
        best_frequency = 0
        for target in frequency:
            if frequency[target] > best_frequency:
                best_target = target
                best_frequency = frequency[target]
        if not best_target:
            best_target = targets[0]
        lemmatized_target = lemmatize_text(best_target)
        if lemmatized_target != best_target and lemmatized_target in targets:
            # print("lemmatized", best_target, "to", lemmatized_target)
            best_target = lemmatized_target
        translation[source] = best_target
        num_phrases = len(phrases)
        if num_phrases == 0:
            num_phrases = 1
        data.append([source, best_target, len(phrases), best_frequency / num_phrases])
    # write_translation_data(data, '../data/translation-data2.txt')
    return translation


def write_translation_data(data, filename):
    # data.sort(reverse=True, key=lambda item: item[2])
    file = open(filename, 'w')
    for item in data:
        file.write(item[0] + " " + item[1] + " " + str(item[2]) + " " + str(item[3]) + "\n")
    file.close()
    print('wrote', filename)


def get_target_for_phrase(phrase, targets, debug=False):
    best_target = None
    best_lemma = None
    for target in targets:
        lemma = lemmatize_text(target)
        pos = phrase.find(lemma)
        if pos != -1:
            if pos > 0 and phrase[pos - 1].isalnum():
                # Matched within a word.
                continue
            end = pos + len(lemma)
            if end < len(phrase) and phrase[end].isalnum():
                # Matched within a word.
                continue
            if best_target is None:
                best_lemma = lemma
                best_target = target
            elif lemma.find(best_lemma) != -1:
                # target contains best_target.
                best_lemma = lemma
                best_target = target
            elif best_lemma.find(lemma) != -1:
                # best_target contains target.
                pass
            else:
                if debug:
                    print('both', lemma, 'and', best_lemma, 'appear in', "'" + phrase + "'")
                if len(best_lemma) < len(lemma):
                    best_lemma = lemma
                    best_target = target
    if best_target is None:
        if debug:
            print('Could not find', targets, 'in', "'" + phrase + "'")
    return best_target


def create_strongs_to_phrases():
    directory = '../../../interlinear_bible'
    dictionary = dict()
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
                        lemmatized_text = lemmatize_text(text)
                        # print(text, '=>', lemmatized_text)
                        dictionary[strongs].append(lemmatized_text)
    return dictionary


def lemmatize_text(text):
    text = text.lower()
    # Get rid of extraneous characters.
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
        if word == 'men':
            noun = 'man'
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
    count = 0
    for source in dictionary:
        entry = dictionary[source]
        targets = get_entry_translations(entry)
        if 'kjv_def' in entry:
            kjv_def = entry['kjv_def']
            if False and kjv_def.find('(') > 0:
                print(source, 'kjv_def:', kjv_def)
                print(source, 'kjv_def:', targets)
                count += 1
        translations[source] = targets
    print(count, 'parentheticals')
    return translations


def get_entry_translations(entry):
    """Get the translations from an open scripture entry."""
    translations = []
    if 'kjv_def' in entry:
        translations = parse_kjv_def(entry['kjv_def'])
    if 'strongs_def' in entry:
        translations += parse_kjv_def(entry['strongs_def'])
    if len(translations) == 0:
        print('ERROR no entries for', entry)
    return translations


def parse_kjv_def(text):
    # Remove curly brackets.
    text = text.replace('{', '')
    text = text.replace('}', '')
    # Remove square brackets.
    while True:
        begin = text.find('[')
        end = text.find(']')
        if begin < 0 or end < 0 or end < begin:
            break
        text = text[0:begin] + text[end + 1:]
    period = find_period(text)
    if period == -1 and text[-1] == '.':
        period = len(text) - 1
    if period > 0:
        text = text[0:period]
    definitions = split_by_commas(text)
    # Filter definitions.
    new_definitions = []
    for definition in definitions:
        if definition.find('...') > 0:
            # Remove ellipsis.
            continue
        if definition.startswith("'"):
            definition = definition[1:]
            if definition.endswith("'"):
                definition = definition[:-1]
        if definition.startswith('a '):
            definition = definition[2:]
        if definition.startswith('an '):
            definition = definition[3:]
        if definition.startswith('the '):
            definition = definition[4:]
        if definition.startswith('to '):
            definition = definition[3:]
        if definition == "" or definition == 'i':
            continue
        new_definitions.append(definition)
    definitions = new_definitions
    return definitions


def find_period(text):
    """Find a top-level period (not within parentheses)."""
    parentheses = 0
    for i in range(0, len(text)):
        if text[i] == '(':
            parentheses += 1
        elif text[i] == ')':
            parentheses += -1
        elif text[i] == '.' and parentheses == 0:
            # Ignore '...'.
            if i > 0 and text[i - 1] == '.':
                continue
            if i < len(text) - 1 and text[i + 1] == '.':
                continue
            return i
    return -1


def split_by_commas(text):
    """Split text by commas, expanding parentheses as alternatives."""
    items = list()
    while True:
        comma_pos = find_comma(text)
        if comma_pos == -1:
            items += expand_parentheses(text)
            break
        items += expand_parentheses(text[0:comma_pos])
        text = text[comma_pos + 1:]
    return items


def find_comma(text):
    """Find a top-level comma (not within parentheses)."""
    parentheses = 0
    for i in range(0, len(text)):
        if text[i] == '(':
            parentheses += 1
        elif text[i] == ')':
            parentheses += -1
        elif text[i] in [',', ';'] and parentheses == 0:
            return i
    return -1

def expand_parentheses(text):
    """Expand parentheses as alternatives."""
    open_paren = text.find('(')
    if open_paren == -1:
        return [text.strip()]
    # Get the next close parenthesis ignoring embedded parentheses.
    close_paren = len(text)
    parentheses = 0
    for i in range(open_paren, len(text)):
        if text[i] == '(':
            parentheses += 1
        elif text[i] == ')':
            parentheses += -1
            if parentheses == 0:
                close_paren = i
                break
    # Break segment by commas.
    segment = text[open_paren + 1: close_paren]
    items = [""]  # parentheses are optional.
    items += split_by_commas(segment)
    if close_paren + 1 == len(text):
        remainders = [""]
    else:
        remainders = expand_parentheses(text[close_paren + 1:])
    new_items = list()
    for item in items:
        if item.find('.') > -1:
            # Not part of a definition.
            continue
        prefix = combine_phrases(text[0:open_paren], item)
        for remainder in remainders:
            new_item = combine_phrases(prefix, remainder)
            new_items.append(new_item)
    return new_items


def combine_phrases(phrase1, phrase2):
    # Combine phrases as words unless there is a hyphen.
    phrase1 = phrase1.strip()
    phrase2 = phrase2.strip()
    if not phrase1:
        return phrase2
    if not phrase2:
        return phrase1
    morphemes = False
    if phrase1[-1] == '-':
        morphemes = True
        phrase1 = phrase1[:-1]
    if phrase2[0] == '-':
        morphemes = True
        phrase2 = phrase2[1:]
    if not phrase1:
        return phrase2
    if not phrase2:
        return phrase1
    if not morphemes:
        return phrase1 + " " + phrase2
    # Combine morphemes.
    result = phrase1 + phrase2
    if phrase1 == 'nine' and phrase2 == 'th':
        result = 'ninth'
    elif phrase1 == 'stone' and phrase2 == 'ny':
        result = 'stony'
    elif phrase1 == 'true' and phrase2 == 'th':
        result = 'truth'
    elif phrase1[-1] == 'e' and len(phrase1) > 1 and phrase1[-2] != 'e' and phrase2 == 'y':
        result = phrase1[0:-1] + phrase2
    elif phrase1[-1] == 'e' and len(phrase1) > 1 and phrase1[-2] != 'e'  and phrase2[0] == 'i':
        result = phrase1[:-1] + phrase2
    elif phrase1[-1] == 'y' and phrase2[0] == 'i':
        result = phrase1[:-1] + phrase2
    # print(phrase1, "+", phrase2, "=", result)
    return result


def old_parse_kjv_def(text):
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
                # print("converted", orig_text, "to\n         ", text)
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
