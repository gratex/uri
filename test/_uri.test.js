const uri = require('../src/_uri.js');
const componentsData = [ // s, a, p, q, f
    'http:',
    'http://',
    'http:/',
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

const isSubordinateData = [

    [ '/a/b/c', '/a/b/c', true, true ],
    [ '/a/b/', '/a/b/c', true, true ],
    [ '/a/b', '/a/b/c', true, true ],
    [ '/a/b/c', '/a/b/d', true, false ],
    [ '/a/b/c', '/a/b/', true, false ],
    [ '/b/', '/a/c/', true, false ],
    [ '/', '/a/b/', true, true ],
    [ '/', '/a/b/', false, true ],
    [ '', '/a/b/', true, true ],
    [ ' ', '/a/b/c/', true, false ],
    [ '//john.doe@www.example.com:123/forum/questions/', '//john.doe@www.example.com:123/forum/questions/', true, true ],
    [ '//john.doe@www.example.com:123/forum/questions/', '//michal.zajic@www.example.com:123/forum/questions/', true, false ]
];

const removeDotSegmentsData = [
    [ '/a/b/c/./../../g', '/a/g' ],
    [ '/.', '/' ],
    [ '/x/..', '/' ],
    [ '/x/../', '/' ],
    [ '/a/../../.', '/' ],
    [ '/./x/../b/c/d', '/b/c/d' ],
    [ '..', '' ],
    [ '.', '' ],
    [ '../', '' ],
    [ './', '' ] // modified from 6.2.2.
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
    [ 'http:g', 'http://a/b/c/d;p?q', 'http:g' ],
    [ './../g', 'http://john.doe@www.example.com:123', 'http://john.doe@www.example.com:123/g' ]
];

const segmentsData = [
    '',
    '/',
    '/a/b',
    '/a/b/'
];

const percentEncodeData = [
    [ '/+', '+/?', '+/%3F' ],
    [ '', '+/?', '%2B%2F%3F' ],
    [ 'abc', 'mama', '%6Da%6Da' ]
];

test('resolve test', (() => {
    function testResolve([ ref, base, expected ]) {
        const res = uri.resolve(uri.decomposeComponents(base), uri.decomposeComponents(ref));
        const resStr = uri.recomposeComponents(res);
        expect(resStr).toEqual(expected);
    }
    resolveData.forEach((item) => testResolve(item));
}));
test('_preParseBaseUri test', (() => {
    const decomposed = uri.decomposeComponents('//a/b/c/d;p?q');
    expect(() => uri.resolve(decomposed, null)).toThrow();
}));
test('percentEncode test', (() => {
    function testPercentEncode([ legalRange, input, expected ]) {
        const res = uri.percentEncode(input, legalRange);
        expect(res).toEqual(expected);
    }
    percentEncodeData.forEach((item) => testPercentEncode(item));
}));
test('component test', (() => {
    function testComponent(original) {
        const decomposed = uri.decomposeComponents(original);
        const recomposed = uri.recomposeComponents(decomposed);
        expect(original).toEqual(recomposed);
    }
    componentsData.forEach((item) => testComponent(item));
}));
test('checkAuthorityInvariant should throw in recompose on invalid input', (() => {
    const decomposed = uri.decomposeComponents('http://a@b:800');
    decomposed.port = '87';
    expect(() => uri.recomposeComponents(decomposed)).toThrow();
    decomposed.host = null;
    expect(() => uri.recomposeComponents(decomposed)).toThrow();
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
    it('4 path-abempty expected', () => {
        expect(() => uri.decodeSegments(' /a')).toThrow();
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
    data = 4;
    expect(() => uri.encodeSegments(data)).toThrow();
}));
test('segments test', (() => {
    function testSegments(original) {
        const decoded = uri.decodeSegments(original);
        const res = uri.encodeSegments(decoded);
        expect(res).toEqual(original);
    }
    segmentsData.forEach((item) => testSegments(item));
}));
test('isSubordinate test', (() => {
    function testIsSubordinate([ parent, sub, orSame, expected ]) {
        const uriParent = uri.decomposeComponents(parent);
        const uriSub = uri.decomposeComponents(sub);
        const res = uri.isSubordinate(uriParent, uriSub, orSame);
        expect(res).toEqual(expected);
    }
    isSubordinateData.forEach((item) => testIsSubordinate(item));
}));
