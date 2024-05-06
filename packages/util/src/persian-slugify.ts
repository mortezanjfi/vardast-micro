export default function slugify(str: string, replacement = "-"): string {
  if (typeof str !== "string") {
    throw new Error("slugify: string argument expected")
  }

  const specialChars: { [key: string]: string | undefined } = {
    ä: "a",
    æ: "ae",
    ǽ: "ae",
    ö: "o",
    œ: "oe",
    ü: "u",
    Ä: "A",
    Ü: "U",
    Ö: "O",
    À: "A",
    Á: "A",
    Â: "A",
    Ã: "A",
    Å: "A",
    Ǻ: "A",
    Ā: "A",
    Ă: "A",
    Ą: "A",
    Ǎ: "A",
    à: "a",
    á: "a",
    â: "a",
    ã: "a",
    å: "a",
    ǻ: "a",
    ā: "a",
    ă: "a",
    ą: "a",
    ǎ: "a",
    ª: "a",
    Ç: "C",
    Ć: "C",
    Ĉ: "C",
    Ċ: "C",
    Č: "C",
    ç: "c",
    ć: "c",
    ĉ: "c",
    ċ: "c",
    č: "c",
    Ð: "D",
    Ď: "D",
    ð: "d",
    ď: "d",
    È: "E",
    É: "E",
    Ê: "E",
    Ë: "E",
    Ē: "E",
    Ĕ: "E",
    Ė: "E",
    Ę: "E",
    Ě: "E",
    è: "e",
    é: "e",
    ê: "e",
    ë: "e",
    ē: "e",
    ĕ: "e",
    ė: "e",
    ę: "e",
    ě: "e",
    Ĝ: "G",
    Ğ: "G",
    Ġ: "G",
    Ģ: "G",
    ĝ: "g",
    ğ: "g",
    ġ: "g",
    ģ: "g",
    Ĥ: "H",
    Ħ: "H",
    ĥ: "h",
    ħ: "h",
    Ì: "I",
    Í: "I",
    Î: "I",
    Ï: "I",
    Ĩ: "I",
    Ī: "I",
    Ĭ: "I",
    Ǐ: "I",
    Į: "I",
    İ: "I",
    ì: "i",
    í: "i",
    î: "i",
    ï: "i",
    ĩ: "i",
    ī: "i",
    ĭ: "i",
    ǐ: "i",
    į: "i",
    ı: "i",
    Ĵ: "J",
    ĵ: "j",
    Ķ: "K",
    ķ: "k",
    Ĺ: "L",
    Ļ: "L",
    Ľ: "L",
    Ŀ: "L",
    Ł: "L",
    ĺ: "l",
    ļ: "l",
    ľ: "l",
    ŀ: "l",
    ł: "l",
    Ñ: "N",
    Ń: "N",
    Ņ: "N",
    Ň: "N",
    ñ: "n",
    ń: "n",
    ņ: "n",
    ň: "n",
    ŉ: "n",
    Ò: "O",
    Ó: "O",
    Ô: "O",
    Õ: "O",
    Ō: "O",
    Ŏ: "O",
    Ǒ: "O",
    Ő: "O",
    Ơ: "O",
    Ø: "O",
    Ǿ: "O",
    ò: "o",
    ó: "o",
    ô: "o",
    õ: "o",
    ō: "o",
    ŏ: "o",
    ǒ: "o",
    ő: "o",
    ơ: "o",
    ø: "o",
    ǿ: "o",
    º: "o",
    Ŕ: "R",
    Ŗ: "R",
    Ř: "R",
    ŕ: "r",
    ŗ: "r",
    ř: "r",
    Ś: "S",
    Ŝ: "S",
    Ş: "S",
    Ș: "S",
    Š: "S",
    ś: "s",
    ŝ: "s",
    ş: "s",
    ș: "s",
    š: "s",
    ſ: "s",
    Ţ: "T",
    Ț: "T",
    Ť: "T",
    Ŧ: "T",
    ţ: "t",
    ț: "t",
    ť: "t",
    ŧ: "t",
    Ù: "U",
    Ú: "U",
    Û: "U",
    Ũ: "U",
    Ū: "U",
    Ŭ: "U",
    Ů: "U",
    Ű: "U",
    Ų: "U",
    Ư: "U",
    Ǔ: "U",
    Ǖ: "U",
    Ǘ: "U",
    Ǚ: "U",
    Ǜ: "U",
    ù: "u",
    ú: "u",
    û: "u",
    ũ: "u",
    ū: "u",
    ŭ: "u",
    ů: "u",
    ű: "u",
    ų: "u",
    ư: "u",
    ǔ: "u",
    ǖ: "u",
    ǘ: "u",
    ǚ: "u",
    ǜ: "u",
    Ý: "Y",
    Ÿ: "Y",
    Ŷ: "Y",
    ý: "y",
    ÿ: "y",
    ŷ: "y",
    Ŵ: "W",
    ŵ: "w",
    Ź: "Z",
    Ż: "Z",
    Ž: "Z",
    ź: "z",
    ż: "z",
    ž: "z",
    Æ: "AE",
    Ǽ: "AE",
    ß: "ss",
    ẞ: "SS",
    Ĳ: "IJ",
    ĳ: "ij",
    Œ: "OE",
    Þ: "TH",
    þ: "TH",
    ƒ: "f",

    α: "a",
    β: "b",
    γ: "g",
    δ: "d",
    ε: "e",
    ζ: "z",
    η: "h",
    θ: "8",
    ι: "i",
    κ: "k",
    λ: "l",
    μ: "m",
    ν: "n",
    ξ: "3",
    ο: "o",
    π: "p",
    ρ: "r",
    σ: "s",
    τ: "t",
    υ: "y",
    φ: "f",
    χ: "x",
    ψ: "ps",
    ω: "w",
    ά: "a",
    έ: "e",
    ί: "i",
    ό: "o",
    ύ: "y",
    ή: "h",
    ώ: "w",
    ς: "s",
    ϊ: "i",
    ΰ: "y",
    ϋ: "y",
    ΐ: "i",
    Α: "A",
    Β: "B",
    Γ: "G",
    Δ: "D",
    Ε: "E",
    Ζ: "Z",
    Η: "H",
    Θ: "8",
    Ι: "I",
    Κ: "K",
    Λ: "L",
    Μ: "M",
    Ν: "N",
    Ξ: "3",
    Ο: "O",
    Π: "P",
    Ρ: "R",
    Σ: "S",
    Τ: "T",
    Υ: "Y",
    Φ: "F",
    Χ: "X",
    Ψ: "PS",
    Ω: "W",
    Ά: "A",
    Έ: "E",
    Ί: "I",
    Ό: "O",
    Ύ: "Y",
    Ή: "H",
    Ώ: "W",
    Ϊ: "I",
    Ϋ: "Y",

    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "j",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sh",
    ъ: "u",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "Yo",
    Ж: "Zh",
    З: "Z",
    И: "I",
    Й: "J",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "C",
    Ч: "Ch",
    Ш: "Sh",
    Щ: "Sh",
    Ъ: "U",
    Ы: "Y",
    Ь: "",
    Э: "E",
    Ю: "Yu",
    Я: "Ya",
    Є: "Ye",
    І: "I",
    Ї: "Yi",
    Ґ: "G",
    є: "ye",
    і: "i",
    ї: "yi",
    ґ: "g",

    Ә: "AE",
    ә: "ae",
    Ғ: "GH",
    ғ: "gh",
    Қ: "KH",
    қ: "kh",
    Ң: "NG",
    ң: "ng",
    Ү: "UE",
    ү: "ue",
    Ұ: "U",
    ұ: "u",
    Һ: "H",
    һ: "h",
    Ө: "OE",
    ө: "oe",

    đ: "dj",
    ǌ: "nj",
    ǉ: "lj",
    Đ: "DJ",
    ǋ: "NJ",
    ǈ: "LJ",
    ђ: "dj",
    ј: "j",
    љ: "lj",
    њ: "nj",
    ћ: "c",
    џ: "dz",
    Ђ: "DJ",
    Ј: "J",
    Љ: "LJ",
    Њ: "NJ",
    Ћ: "C",
    Џ: "DZ",

    "€": "euro",
    "₢": "cruzeiro",
    "₣": "french franc",
    "£": "pound",
    "₤": "lira",
    "₥": "mill",
    "₦": "naira",
    "₧": "peseta",
    "₨": "rupee",
    "₩": "won",
    "₪": "new shequel",
    "₫": "dong",
    "₭": "kip",
    "₮": "tugrik",
    "₸": "kazakhstani tenge",
    "₯": "drachma",
    "₰": "penny",
    "₱": "peso",
    "₲": "guarani",
    "₳": "austral",
    "₴": "hryvnia",
    "₵": "cedi",
    "¢": "cent",
    "¥": "yen",
    元: "yuan",
    円: "yen",
    "﷼": "rial",
    "₠": "ecu",
    "¤": "currency",
    "฿": "baht",
    $: "dollar",
    "₽": "russian ruble",
    "₿": "bitcoin",
    "₺": "turkish lira",

    "∂": "d",
    "™": "tm",
    "℠": "sm",
    "˚": "o",
    "∆": "delta",
    "∞": "infinity",
    "♥": "love",
    "&": "and",
    "|": "or",
    "<": "less",
    ">": "greater",

    ة: "ه",
    ك: "ک",
    ي: "ی",
    ؤ: "و",
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",

    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",

    ء: "",
    ʾ: "",
    ـ: ""
  }

  let slug = ""
  for (let i = 0; i < str.length; i++) {
    const chr = str[i] as string
    slug +=
      chr === replacement ? " " : chr in specialChars ? specialChars[chr] : chr
  }

  return slug
    .toLowerCase()
    .replace(/[^\s\p{Zs}\p{Ll}\p{Lm}\p{Lo}\p{Lt}\p{Lu}\p{Nd}]+/gmu, "")
    .replace(/[\s\p{Zs}]/gmu, " ")
    .trim()
    .replace(/\s+/g, replacement)
}
