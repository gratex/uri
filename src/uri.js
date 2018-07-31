const uri = require('./_uri.js');
const isEqualWith = require('lodash.isequalwith');

function equalsQueryStr(query1, query2) {
    function simpleCompare(a, b) {
        return (a < b ? -1 : (a > b ? 1 : 0));
    }

    function customizer(a, b) {
        if (Array.isArray(a) && Array.isArray(b)) {
            // order is not important, so just sort them before comparing
            a.sort(simpleCompare);
            b.sort(simpleCompare);
        }
        return undefined; // isEqualWith will do the job if we return undef
    }

    if (!query1 || !query2) {
        return query1 === query2;
    }
    const q1 = uri.parseQuery(query1);
    const q2 = uri.parseQuery(query2);

    return isEqualWith(q1, q2, customizer);
}

function isSubPath(baseStr, refStr) {
    const bs = uri.decodeSegments(baseStr);
    const rs = uri.decodeSegments(refStr);

    if (bs.length > rs.length) {
        return false;
    }
    if (bs[bs.length - 1] === '') { // dont compare with void segment
        bs.pop();
    }
    return bs.reverse().every((item, i) => item === rs[bs.length - 1 - i]);
}

module.exports = {
    equalsQueryStr,
    isSubPath
};

