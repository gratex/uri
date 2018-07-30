// const uri = require('./_uri.js');
const querystring = require('querystring');
const isEqual = require('lodash.isequal');

function simpleCompare(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    }
    return 0;
}

function equals(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return isEqual(a.sort(simpleCompare), b.sort(simpleCompare));
    }
    return a === b;
}

function _equalsQueryStr(query1, query2) {
    if (!query1 || !query2) {
        return query1 === query2;
    }
    const q1 = querystring.parse(query1);
    const q2 = querystring.parse(query2);
    for (const i in q1) {
        if (!equals(q1[i], q2[i])) {
            return false;
        }
    }

    for (const i in q2) {
        if (!equals(q2[i], q1[i])) {
            return false;
        }
    }
    return true;
}

module.exports = {
    _equalsQueryStr,
    equals,
    simpleCompare
};

