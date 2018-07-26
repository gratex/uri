function uriBuilder(characters, ...insertedValues) {
    // tag for template literal
    // TODO: implement
    return characters.reduce((lastChar, currentChar, currentId) =>
        `${lastChar}${encodeURIComponent(insertedValues[currentId - 1])}${currentChar}`);
}

function raw() {
    // return something that will tell uriBuilder not to encode
    // (hint: see EncodedString in gjax impl.)
    // TODO: implement
}

module.exports = {
    uriBuilder,
    raw
};
