import json


def create_strongs_to_english():
    """Create a dictionary from strong's numbers to english."""
    filename = '../../../strongs/hebrew/strongs-hebrew-dictionary.json'
    hebrew_translations = get_strongs_dict_translations(filename)
    hebrew_translation = choose_least_shared_translations(hebrew_translations)
    # print(hebrew_translation)


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


if __name__ == '__main__':
    create_strongs_to_english()
