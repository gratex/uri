const RFC2396_DIGIT = '0-9';
const RFC2396_LOWALPHA = 'a-z';
const RFC2396_UPALPHA = 'A-Z';
const RFC2396_ALPHA = RFC2396_LOWALPHA + RFC2396_UPALPHA;
const RFC2396_ALPHANUM = RFC2396_DIGIT + RFC2396_ALPHA;
const RFC3986_UNRESERVED = `${RFC2396_ALPHANUM}-._~`;
const RFC3986_SUBDELIMS = '\u0021\u0024\u0026\u0027\u0028\u0029\u002a\u002b\u002c\u003b\u003d';
const RFC3986_PCT_ENCODED = '';
const RFC3986_REG_NAME = `${RFC3986_UNRESERVED}${RFC3986_PCT_ENCODED}${RFC3986_SUBDELIMS}`;
const RFC3986_PCHAR = `${RFC3986_REG_NAME}:@`;
const RFC3986_QUERY = `${RFC3986_PCHAR}?/`;
const RFC3986_SEGMENT = RFC3986_PCHAR;
const RFC3986_FRAGMENT = `${RFC3986_PCHAR}?/`; /* "?/" */
const RFC3986_PATH_SEGMENTS = `${RFC3986_SEGMENT}/`; /* "/" */

const uri = require('../src/_uri.js');
const componentsData = [ // s, a, p, q, f
    'http:',
    'http://',
    'http://host',
    'http://@host',
    'http://l@',
    'http://l@:9090',
    'http://@',
    'http:///p',
    'http://l:p@host:8080/s1/s2?q#f',
    'http://host'
];

const encodeQueryData = [
    [ 'abcd', 'abcd' ],
    [ ' ', '%20' ]
];

const removeDotSegmentsData = [
    [ '/a/b/c/./../../g', '/a/g' ],
    [ '/.', '/' ],
    [ '/x/..', '/' ],
    [ '/x/../', '/' ],
    [ '/a/../../.', '/' ],
    [ '/./x/../b/c/d', '/b/c/d' ] // modified from 6.2.2.
];

const resolveData = [
    // ref //base //expected value
    [ 'g:h', 'http://a/b/c/d;p?q', 'g:h' ],
    [ 'g', 'http://a/b/c/d;p?q', 'http://a/b/c/g' ],
    [ './g', 'http://a/b/c/d;p?q', 'http://a/b/c/g' ],
    [ 'g/', 'http://a/b/c/d;p?q', 'http://a/b/c/g/' ],
    [ '/g', 'http://a/b/c/d;p?q', 'http://a/g' ],
    [ '//g', 'http://a/b/c/d;p?q', 'http://g' ],
    [ '?y', 'http://a/b/c/d;p?q', 'http://a/b/c/d;p?y' ],
    [ 'g?y', 'http://a/b/c/d;p?q', 'http://a/b/c/g?y' ],
    [ '#s', 'http://a/b/c/d;p?q', 'http://a/b/c/d;p?q#s' ],
    [ 'g#s', 'http://a/b/c/d;p?q', 'http://a/b/c/g#s' ],
    [ 'g?y#s', 'http://a/b/c/d;p?q', 'http://a/b/c/g?y#s' ],
    [ ';x', 'http://a/b/c/d;p?q', 'http://a/b/c/;x' ],
    [ 'g;x', 'http://a/b/c/d;p?q', 'http://a/b/c/g;x' ],
    [ 'g;x?y#s', 'http://a/b/c/d;p?q', 'http://a/b/c/g;x?y#s' ],
    [ '', 'http://a/b/c/d;p?q', 'http://a/b/c/d;p?q' ],
    [ '.', 'http://a/b/c/d;p?q', 'http://a/b/c/' ],
    [ './', 'http://a/b/c/d;p?q', 'http://a/b/c/' ],

    [ '..', 'http://a/b/c/d;p?q', 'http://a/b/' ],
    [ '../', 'http://a/b/c/d;p?q', 'http://a/b/' ],
    [ '../g', 'http://a/b/c/d;p?q', 'http://a/b/g' ],
    [ '../..', 'http://a/b/c/d;p?q', 'http://a/' ],
    [ '../../', 'http://a/b/c/d;p?q', 'http://a/' ],
    [ '../../g', 'http://a/b/c/d;p?q', 'http://a/g' ],

    // abnormal
    [ '../../../g', 'http://a/b/c/d;p?q', 'http://a/g' ],
    [ '../../../../g', 'http://a/b/c/d;p?q', 'http://a/g' ],
    [ '/./g', 'http://a/b/c/d;p?q', 'http://a/g' ],
    [ '/../g', 'http://a/b/c/d;p?q', 'http://a/g' ],
    [ 'g.', 'http://a/b/c/d;p?q', 'http://a/b/c/g.' ],
    [ '.g', 'http://a/b/c/d;p?q', 'http://a/b/c/.g' ],
    [ 'g..', 'http://a/b/c/d;p?q', 'http://a/b/c/g..' ],
    [ '..g', 'http://a/b/c/d;p?q', 'http://a/b/c/..g' ],

    [ './../g', 'http://a/b/c/d;p?q', 'http://a/b/g' ],
    [ './g/.', 'http://a/b/c/d;p?q', 'http://a/b/c/g/' ],
    [ 'g/./h', 'http://a/b/c/d;p?q', 'http://a/b/c/g/h' ],
    [ 'g/../h', 'http://a/b/c/d;p?q', 'http://a/b/c/h' ],
    [ 'g;x=1/./y', 'http://a/b/c/d;p?q', 'http://a/b/c/g;x=1/y' ],
    [ 'g;x=1/../y', 'http://a/b/c/d;p?q', 'http://a/b/c/y' ],

    [ 'g?y/./x', 'http://a/b/c/d;p?q', 'http://a/b/c/g?y/./x' ],
    [ 'g?y/../x', 'http://a/b/c/d;p?q', 'http://a/b/c/g?y/../x' ],
    [ 'g#s/./x', 'http://a/b/c/d;p?q', 'http://a/b/c/g#s/./x' ],
    [ 'g#s/../x', 'http://a/b/c/d;p?q', 'http://a/b/c/g#s/../x' ],
    // if strict
    [ 'http:g', 'http://a/b/c/d;p?q', 'http:g' ]
];

const segmentsData = [
    '',
    '/',
    '/a/b',
    '/a/b/'
];

const checkSegmentsEncodingData = [
    [ 'http:', RFC3986_PATH_SEGMENTS ],
    [ 'http://', RFC3986_PATH_SEGMENTS ],
    [ 'http://host', RFC3986_PATH_SEGMENTS ],
    [ 'http://@host', RFC3986_PATH_SEGMENTS ],
    [ 'http://l@', RFC3986_PATH_SEGMENTS ],
    [ 'http://l@:9090', RFC3986_PATH_SEGMENTS ],
    [ 'http://@', RFC3986_PATH_SEGMENTS ],
    [ 'http:///p', RFC3986_PATH_SEGMENTS ],
    [ 'http://l:p@host:8080/s1/s2?q#f', RFC3986_PATH_SEGMENTS ],
    [ 'http://host', RFC3986_PATH_SEGMENTS ]
];

const checkSegmentEncodingData = [
    [ 'http:', RFC3986_SEGMENT ],
    [ 'http://', RFC3986_SEGMENT ],
    [ 'http://host', RFC3986_SEGMENT ],
    [ 'http://@host', RFC3986_SEGMENT ],
    [ 'http://l@', RFC3986_SEGMENT ],
    [ 'http://l@:9090', RFC3986_SEGMENT ],
    [ 'http://@', RFC3986_SEGMENT ],
    [ 'http:///p', RFC3986_SEGMENT ],
    [ 'http://l:p@host:8080/s1/s2?q#f', RFC3986_SEGMENT ],
    [ 'http://host', RFC3986_SEGMENT ]
];

const checkQueryEncodingData = [
    [ 'http:', RFC3986_QUERY ],
    [ 'http://', RFC3986_QUERY ],
    [ 'http://host', RFC3986_QUERY ],
    [ 'http://@host', RFC3986_QUERY ],
    [ 'http://l@', RFC3986_QUERY ],
    [ 'http://l@:9090', RFC3986_QUERY ],
    [ 'http://@', RFC3986_QUERY ],
    [ 'http:///p', RFC3986_QUERY ],
    [ 'http://l:p@host:8080/s1/s2?q#f', RFC3986_QUERY ],
    [ 'http://host', RFC3986_QUERY ]
];

const checkFragmentEncodingData = [
    [ 'http:', RFC3986_FRAGMENT ],
    [ 'http://', RFC3986_FRAGMENT ],
    [ 'http://host', RFC3986_FRAGMENT ],
    [ 'http://@host', RFC3986_FRAGMENT ],
    [ 'http://l@', RFC3986_FRAGMENT ],
    [ 'http://l@:9090', RFC3986_FRAGMENT ],
    [ 'http://@', RFC3986_FRAGMENT ],
    [ 'http:///p', RFC3986_FRAGMENT ],
    [ 'http://l:p@host:8080/s1/s2?q#f', RFC3986_FRAGMENT ],
    [ 'http://host', RFC3986_FRAGMENT ]
];

const parseQueryData = [];

test('resolve test', (() => {
    function testResolve([ ref, base, expected ]) {
        const res = uri.resolve(uri.decomposeComponents(base), uri.decomposeComponents(ref));
        const resStr = uri.recomposeComponents(res);
        expect(resStr).toEqual(expected);
    }
    resolveData.forEach((item) => testResolve(item));
}));

test('component test', (() => {
    function testComponent(original) {
        const decomposed = uri.decomposeComponents(original);
        const recomposed = uri.recomposeComponents(decomposed);
        expect(original).toEqual(recomposed);
    }
    componentsData.forEach((item) => testComponent(item));
}));

test('encode query test', (() => {
    function testEncodeQuery([ original, expected ]) {
        const res = uri.encodeQuery(original);
        expect(res).toEqual(expected);
    }
    encodeQueryData.forEach((item) => testEncodeQuery(item));
}));

test('removeDotSegments test', (() => {
    function testRemoveDotSegments([ original, expected ]) {
        const res = uri.removeDotSegments(original);
        expect(res).toEqual(expected);
    }
    removeDotSegmentsData.forEach((item) => testRemoveDotSegments(item));
}));

describe('decodeSegments test', (() => {
    it('empty array expected', () => {
        const a0 = uri.decodeSegments('');
        expect(a0.length === 0).toBeTruthy();
    });
    it('1 void segment expected', () => {
        const a1 = uri.decodeSegments('/');
        expect(a1.length === 1 && a1[0] === '').toBeTruthy();
    });
    it('2 segmentsData a,b expected', () => {
        const a2 = uri.decodeSegments('/a/b');
        expect(a2.length === 2 && a2[0] === 'a' && a2[1] === 'b').toBeTruthy();
    });
    it('3 segmentsData a,b,void expected', () => {
        const a3 = uri.decodeSegments('/a/b/');
        expect(a3.length === 3 && a3[0] === 'a' && a3[1] === 'b' && a3[2] === '').toBeTruthy();
    });
}));

test('encodeSegments tests', (() => {
    let data = [];
    let stringPath = uri.encodeSegments(data);
    expect(stringPath).toBe('');
    data = [ 'a', 'b' ];
    stringPath = uri.encodeSegments(data);
    expect(stringPath).toBe('/a/b');
    data = [ 'a', 'b', '' ];
    stringPath = uri.encodeSegments(data);
    expect(stringPath).toBe('/a/b/');
}));

test('segments test', (() => {
    function testSegments(original) {
        const decoded = uri.decodeSegments(original);
        const res = uri.encodeSegments(decoded);
        expect(res).toEqual(original);
    }
    segmentsData.forEach((item) => testSegments(item));
}));

test('checkEncoding test', (() => {
    function testCheckEncoding([ original, legalRange ]) {
        expect(original).toMatch(new RegExp(`[${legalRange}]`));
        expect(original).toMatch(/(?:%[0-9A-Fa-f]{2}){1,}|./g);
    }
    checkSegmentsEncodingData.forEach((item) => testCheckEncoding(item));
    checkSegmentEncodingData.forEach((item) => testCheckEncoding(item));
    checkQueryEncodingData.forEach((item) => testCheckEncoding(item));
    checkFragmentEncodingData.forEach((item) => testCheckEncoding(item));
}));

test('parseQuery test'(() => {
    function testParseQuery() {

    }
    parseQueryData.forEach((item) => testParseQuery(item));
}));
