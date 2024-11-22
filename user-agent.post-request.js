/**
 * Class representing an encryption utility.
 */
class Encrypt {
  /**
   * Generates a sequence based on the given index.
   * @param {number} index - The index to generate the sequence.
   * @returns {number[]} An array of numbers representing the generated key.
   */
  rk(index) {
    const sequence = this.sc();
    const step = (index % 3) + 1;
    return Array.from(
      { length: 10 },
      (_, t) => sequence[(index + t * step) % sequence.length],
    );
  }

  /**
   * Returns a predefined sequence of hexadecimal values.
   * @returns {number[]} A sequence of numbers.
   */
  sc() {
    return [
      0x3a, 0x2b, 0xc5, 0x85, 0x4, 0xa5, 0x6e, 0x3, 0x2c, 0xca, 0xba, 0x1c,
      0x76, 0xb1, 0x20, 0x5e, 0xdb, 0x6, 0xc7, 0x1b, 0x65, 0xbf, 0x42, 0x73,
      0xea, 0x78, 0xa, 0xec, 0x68, 0x6c, 0x4a, 0xf7, 0x44, 0xc6, 0x3e, 0xcb,
      0x11, 0x66, 0xb9, 0x2a,
    ].slice(-36, -4);
  }

  /**
   * Encrypts the input string using a generated key.
   * @param {string} input - The input string to encrypt.
   * @param {number} key - The key index to use for encryption.
   * @returns {number[]} An array of encrypted character codes.
   */
  ec(input, key) {
    const reversedKey = this.rk(key).reverse();
    const charCodes = Array.from(input, (char) => char.charCodeAt(0));
    const extendedKey = this.extendKey(reversedKey, charCodes.length);
    return charCodes.map((code, index) => code ^ extendedKey[index]);
  }

  /**
   * Extends a given key to match the desired length.
   * @param {number[]} key - The key to extend.
   * @param {number} length - The desired length of the key.
   * @returns {number[]} The extended key.
   */
  extendKey(key, length) {
    let extended = [];
    while (extended.length < length) {
      extended = [...extended, ...key];
    }
    return extended;
  }
}

/**
 * Class representing an encryptor utility.
 */
class Encryptor {
  /**
   * Creates an Encryptor instance.
   * @param {string} arq - An arbitrary string parameter.
   */
  constructor(arq) {
    this.arq = arq;
    this.cn = "%\\6SaCzTYFe~Wua?ak";
    this.a = "Phapix";
  }

  /**
   * Extracts a substring from the given string.
   * @param {string} str - The string to process.
   * @param {number} length - The length of the substring.
   * @param {number} offset - The offset from the end of the string.
   * @returns {string} The processed substring.
   */
  mc(str, length, offset) {
    return str.slice(-length).slice(0, length - offset);
  }

  /**
   * Generates a random integer between 1 and max (inclusive).
   * @param {number} max - The maximum value for the random number.
   * @returns {number} A random integer.
   */
  rnd(max) {
    return Math.ceil(Math.random() * max);
  }

  /**
   * Checks if an API endpoint matches a specific prefix pattern.
   * @param {string} endpoint - The API endpoint to check.
   * @returns {string} The extracted and uppercased endpoint if it matches, otherwise an empty string.
   */
  isapi(endpoint) {
    const prefix = this.mc(this.a, 4, 1);
    let lowerEndpoint = endpoint?.toLowerCase() || "";
    if (lowerEndpoint.startsWith(prefix + "/")) {
      lowerEndpoint = "/" + lowerEndpoint;
    }
    return lowerEndpoint.includes("/" + prefix + "/")
      ? lowerEndpoint.split("/" + prefix + "/")[1].toUpperCase()
      : "";
  }

  /**
   * Generates an encrypted user agent string.
   * @param {string} input - The input string to encrypt.
   * @returns {string} The encrypted string encoded in base64.
   */
  gc(input) {
    const timestamp = new Date().getTime();
    const random1 = this.rnd(89) + 10;
    const random2 = this.rnd(89) + 10;
    const key = `${random1}${timestamp}${random2}${input}`;
    const random3 = this.rnd(31);
    const encryptedChars = [random3 + 32, ...new Encrypt().ec(key, random3)]
      .map((code) => String.fromCharCode(code))
      .join("");
    return btoa(encryptedChars);
  }
}

const encryptor = new Encryptor();
const apiPath = pm.request.url.getPath();
const encryptedUserAgent = encryptor.gc(encryptor.isapi(apiPath));

pm.request.headers.add({
  key: "ua",
  value: encryptedUserAgent,
});
