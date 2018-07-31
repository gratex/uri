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
    'http://host',
    '//host'
];

const encodeQueryData = [
    [ 'abcd', 'abcd' ],
    [ ' ', '%20' ]
];
const encodeSegmentData = [
    [ 'abcd', 'abcd' ],
    [ ' ', '%20' ],
    [ '', '' ]
];

const encodeFragmentData = [
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
    [ '/..', '/' ],
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
    [ './../g', 'http://john.doe@www.example.com:123', 'http://john.doe@www.example.com:123/g' ],
    [ './../^g*', 'http://a/b/c;p?q', 'http://a/^g*' ],
    [ './../^g*', 'http:', 'http:^g*' ]
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

const checkSegmentsEncodingData = [
    [],
    [ 'http:' ],
    [ '%6Da%6Da%D1%88%D0%B5%D0%BB%D0%BB%D1%8B' ],
    [ '%E0%A4%A', 'Error' ],
    [ 'http://' ],
    [ 'http://host' ],
    [ 'http://@host' ],
    [ 'http://l@' ],
    [ 'http://l@:9090' ],
    [ 'http://@' ],
    [ 'http:///p' ],
    [ 'http://l:p@host:8080/s1/s2?q#f', 'Error' ],
    [ 'http://host' ]
];

const checkSegmentEncodingData = [
    [],
    [ 'http:' ],
    [ 'http://', 'Error' ],
    [ 'http://host', 'Error' ],
    [ 'http://@host', 'Error' ],
    [ 'http://l@', 'Error' ],
    [ 'http://l@:9090', 'Error' ],
    [ 'http://@', 'Error' ],
    [ 'http:///p', 'Error' ],
    [ 'http://l:p@host:8080/s1/s2?q#f', 'Error' ],
    [ 'http://host', 'Error' ]
];

const checkQueryEncodingData = [
    [],
    [ 'http:' ],
    [ 'http://' ],
    [ 'http://host' ],
    [ 'http://@host' ],
    [ 'http://l@' ],
    [ 'http://l@:9090' ],
    [ 'http://@' ],
    [ 'http:///p' ],
    [ 'http://l:p@host:8080/s1/s2?q#f', 'Error' ],
    [ 'http://host' ]
];

const checkFragmentEncodingData = [
    [],
    [ 'http:' ],
    [ 'http://' ],
    [ 'http://host' ],
    [ 'http://@host' ],
    [ 'http://l@' ],
    [ 'http://l@:9090' ],
    [ 'http://@' ],
    [ 'http:///p' ],
    [ 'http://l:p@host:8080/s1/s2?q#f', 'Error' ],
    [ 'http://host' ]
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
    let decomposed = uri.decomposeComponents('http://a@b:800');
    decomposed.port = '87';
    expect(() => uri.recomposeComponents(decomposed)).toThrow();

    decomposed = uri.decomposeComponents('http://a@b:800');
    decomposed.host = 'c';
    expect(() => uri.recomposeComponents(decomposed)).toThrow();

    decomposed = uri.decomposeComponents('http://a@b:800');
    decomposed.userInfo = 'c';
    expect(() => uri.recomposeComponents(decomposed)).toThrow();

    decomposed = uri.decomposeComponents('http://a@b:800');
    decomposed.authority = 'b@b:800';
    expect(() => uri.recomposeComponents(decomposed)).toThrow();
}));
test('recomposeAuthorityComponents test', (() => {
    expect(uri.recomposeAuthorityComponents('foo', 'bar', '123')).toBe('foo@bar:123');
    expect(uri.recomposeAuthorityComponents(null, 'bar', '123')).toBe('bar:123');
    expect(uri.recomposeAuthorityComponents('foo', 'bar')).toBe('foo@bar');
    expect(uri.recomposeAuthorityComponents(null, 'bar')).toBe('bar');
    expect(() => uri.recomposeAuthorityComponents('foo', null, '123')).toThrow();
}));
test('encode query test', (() => {
    function testEncodeQuery([ original, expected ]) {
        const res = uri.encodeQuery(original);
        expect(res).toEqual(expected);
    }
    encodeQueryData.forEach((item) => testEncodeQuery(item));
}));

test('encode segment test', (() => {
    function testEncodeSegment([ original, expected ]) {
        const res = uri.encodeSegment(original);
        expect(res).toEqual(expected);
    }
    encodeSegmentData.forEach((item) => testEncodeSegment(item));
}));
test('encode fragment test', (() => {
    function testEncodeFragment([ original, expected ]) {
        const res = uri.encodeFragment(original);
        expect(res).toEqual(expected);
    }
    encodeFragmentData.forEach((item) => testEncodeFragment(item));
}));
test('removeDotSegments test', (() => {
    function testRemoveDotSegments([ original, expected ]) {
        const res = uri.removeDotSegments(original);
        expect(res).toEqual(expected);
    }
    removeDotSegmentsData.forEach((item) => testRemoveDotSegments(item));
}));

describe('decodeSegments test', (() => {
    test('empty array expected', () => {
        const a0 = uri.decodeSegments('');
        expect(a0).toHaveLength(0);
    });
    test('1 void segment expected', () => {
        const a1 = uri.decodeSegments('/');
        expect(a1).toHaveLength(1);
        expect(a1[0]).toBe('');
    });
    test('2 segmentsData a,b expected', () => {
        const a2 = uri.decodeSegments('/a/b');
        expect(a2).toHaveLength(2);
        expect(a2[0]).toBe('a');
        expect(a2[1]).toBe('b');
    });
    test('3 segmentsData a,b,void expected', () => {
        const a3 = uri.decodeSegments('/a/b/');
        expect(a3).toHaveLength(3);
        expect(a3[0]).toBe('a');
        expect(a3[1]).toBe('b');
        expect(a3[2]).toBe('');
    });
    test('4 path-abempty expected', () => {
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

describe('parseQuery test', (() => {
    test('empty string expected using true ', () => {
        const a0 = uri.parseQuery('', true);
        expect(a0).toEqual({});
    });
    test('empty string expected using false', () => {
        const a1 = uri.parseQuery('', false);
        expect(a1).toEqual({});
    });
    test('null string expected using true', () => {
        const a2 = uri.parseQuery(null, true);
        expect(a2).toEqual(null);
    });
    test('null string expected using false', () => {
        const a3 = uri.parseQuery(null);
        expect(a3).toEqual(null);
    });
    test('string query expected', () => {
        const a4 = uri.parseQuery('x=10&y=5&x=6&x=8', true);
        expect(a4).toEqual({ x: [ '10', '6', '8' ], y: '5' });
    });
    test('string query expected', () => {
        const a4 = uri.parseQuery('x=10&y=5&x=6&x=8');
        expect(a4).toEqual({ x: [ '10', '6', '8' ], y: '5' });
    });
}));

test('checkSegmentsEncoding test', (() => {
    function testCheckSegmentsEncoding([ original, ThrowMessage ]) {
        const res = uri.checkSegmentsEncoding(original);
        if (!ThrowMessage) {
            expect(res).toEqual(null);
        } else {
            expect(() => uri.checkSegmentsEncoding(original, ThrowMessage)).toThrow();
        }
    }
    checkSegmentsEncodingData.forEach((item) => testCheckSegmentsEncoding(item));
}));

test('checkSegmentEncoding test', (() => {
    function testCheckSegmentEncoding([ original, ThrowMessage ]) {
        const res = uri.checkSegmentEncoding(original);
        if (!ThrowMessage) {
            expect(res).toEqual(null);
        } else {
            expect(() => uri.checkSegmentEncoding(original, ThrowMessage)).toThrow();
        }
    }
    checkSegmentEncodingData.forEach((item) => testCheckSegmentEncoding(item));
}));

test('checkQueryEncoding test', (() => {
    function testCheckQueryEncoding([ original, ThrowMessage ]) {
        const res = uri.checkQueryEncoding(original);
        if (!ThrowMessage) {
            expect(res).toEqual(null);
        } else {
            expect(() => uri.checkQueryEncoding(original, ThrowMessage)).toThrow();
        }
    }
    checkQueryEncodingData.forEach((item) => testCheckQueryEncoding(item));
}));

test('checkFragmentEncoding test', (() => {
    function testFragmentEncoding([ original, ThrowMessage ]) {
        const res = uri.checkFragmentEncoding(original);
        if (!ThrowMessage) {
            expect(res).toEqual(null);
        } else {
            expect(() => uri.testFragmentEncoding(original, ThrowMessage)).toThrow();
        }
    }
    checkFragmentEncodingData.forEach((item) => testFragmentEncoding(item));
}));
