var strongs_to_english_override = {
    "H168": "tent",  // more general than "tabernacle"
    "H408": "not",  // less archaic than "nay"
    "H802": "woman",  // More general than "wife"
    "H518": "if",  // fits better than "or"
    "H853": "(dobj)",  // object marker
    "H1715": "grain",  // less archaic than "corn"
    "H2388": "be strong",  // more common than "repair"
    "H2814": "be silent",  // better than "still"
    "H3068": "the LORD",  // Use capitals for Yahweh.
    "H3069": "GOD",  // Use capitals for Yahweh.
    "H3254": "add",  // more verb-like than "again"
    "H3381": "go out",  // more common than "go down"
    "H3588": "for",  // more causal than "that"
    "H3605": "all",  // fits better than "whatsoever"
    "H3618": "daughter in law",  // more common than "bride" (problem with hyphens)
    "H3881": "Levite",  // correction for "Leviite"
    "H3978": "food",  // less archaic than "meat"
    "H4390": "be full",  // better for Qal than "fill"
    "H4397": "messenger",  // more general than "angel"
    "H4503": "offering",  // more common than "meat offering"
    "H4616": "for the sake of",  // covers more cases than "so" or "in order to/that"
    "H4672": "find",  // "being" was 20%
    "H5002": "say",  // less archaic than "saith"
    "H5221": "strike",  // better than "smite"
    "H5344": "designate",  // better than "express"
    "H5493": "take away",  // more common than "depart"
    "H5674": "pass over",  // more common than "pass"
    "H5750": "still",  // fits better than "yet"
    "H5769": "forever",  // prefer over "for ever"
    "H6153": "evening",  // less archaic than "even"
    "H7126": "come near",  // more general than "offer"
    "H7130": "midst",  // [in] midst [of] is better than "among"
    "H7901": "lie down",  // less ambiguous than "lie"
    "H8252": "be quiet",  // better than "quiet"
}

if (typeof window === 'undefined') {
    module.exports = strongs_to_english_override;
}