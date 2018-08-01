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

const checkSegmentEncodingData = [
    [ '', true ],
    [ 'foo', true ],
    [ 'a/b', false ],
    [ 'a?b', false ],
    [ 'a#b', false ],
    [ ' ', false ],
    [ '%99', false ]
];

const checkSegmentsEncodingData = [
    [ '', true ],
    [ 'foo', true ],
    [ 'a/b', true ],
    [ 'a?b', false ],
    [ 'a#b', false ],
    [ ' ', false ],
    [ '%99', false ]
];

const checkQueryEncodingData = [
    [ '', true ],
    [ 'foo', true ],
    [ 'a/b', true ],
    [ 'a?b', true ],
    [ 'a#b', false ],
    [ ' ', false ],
    [ '%99', false ]
];

const checkFragmentEncodingData = [
    [ '', true ],
    [ 'foo', true ],
    [ 'a/b', true ],
    [ 'a?b', true ],
    [ 'a#b', false ],
    [ ' ', false ],
    [ '%99', false ]
];

test.each(resolveData)('resolve test: [%p, %p, %p]',
    (ref, base, expected) => {
        const res = uri.resolve(uri.decomposeComponents(base), uri.decomposeComponents(ref));
        const resStr = uri.recomposeComponents(res);
        expect(resStr).toBe(expected);
    });

test('_preParseBaseUri test', (() => {
    const decomposed = uri.decomposeComponents('//a/b/c/d;p?q');
    expect(() => uri.resolve(decomposed, null)).toThrow();
}));

test.each(percentEncodeData)(
    'percentEncode test: [%p, %p, %p]',
    (legalRange, input, expected) => {
        const res = uri.percentEncode(input, legalRange);
        expect(res).toBe(expected);
    }
);

test.each(componentsData)(
    'component test: [%p, %p, %p]',
    (original) => {
        const decomposed = uri.decomposeComponents(original);
        const recomposed = uri.recomposeComponents(decomposed);
        expect(original).toBe(recomposed);
    }
);

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

test.each(encodeQueryData)(
    'encode query test: [%p, %p]',
    (original, expected) => {
        const res = uri.encodeQuery(original);
        expect(res).toBe(expected);
    }
);

test.each(encodeSegmentData)(
    'encode segment test: [%p, %p]',
    (original, expected) => {
        const res = uri.encodeSegment(original);
        expect(res).toBe(expected);
    }
);

test.each(encodeFragmentData)(
    'encode fragment test: [%p, %p]',
    (original, expected) => {
        const res = uri.encodeFragment(original);
        expect(res).toBe(expected);
    }
);

test.each(removeDotSegmentsData)(
    'removeDotSegments test: [%p, %p]',
    (original, expected) => {
        const res = uri.removeDotSegments(original);
        expect(res).toBe(expected);
    }
);

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

test.each(segmentsData)(
    'segments test: %p',
    (original) => {
        const decoded = uri.decodeSegments(original);
        const res = uri.encodeSegments(decoded);
        expect(res).toBe(original);
    }
);

test.each(isSubordinateData)(
    'isSubordinate test: [%p, %p, %p, %p]',
    (parent, sub, orSame, expected) => {
        const uriParent = uri.decomposeComponents(parent);
        const uriSub = uri.decomposeComponents(sub);
        const res = uri.isSubordinate(uriParent, uriSub, orSame);
        expect(res).toBe(expected);
    }
);

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
        expect(a2).toBeNull();
    });
    test('null string expected using false', () => {
        const a3 = uri.parseQuery(null);
        expect(a3).toBeNull();
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

function checkEncoding(checkFn, value, isCorrectValue) {
    if (isCorrectValue) {
        expect(checkFn(value)).toBeNull();
    } else {
        expect(checkFn(value)).not.toBeNull();
        expect(() => checkFn(value, true)).toThrow();
    }
}

test.each(checkSegmentEncodingData)(
    'checkSegmentEncoding test: [%p, %p]',
    (value, isCorrectValue) => checkEncoding(uri.checkSegmentEncoding, value, isCorrectValue)
);

test.each(checkSegmentsEncodingData)(
    'checkSegmentsEncoding test: [%p, %p]',
    (value, isCorrectValue) => checkEncoding(uri.checkSegmentsEncoding, value, isCorrectValue)
);

test.each(checkQueryEncodingData)(
    'checkQueryEncoding test: [%p, %p]',
    (value, isCorrectValue) => checkEncoding(uri.checkQueryEncoding, value, isCorrectValue)
);

test.each(checkFragmentEncodingData)(
    'checkFragmentEncoding test: [%p, %p]',
    (value, isCorrectValue) => checkEncoding(uri.checkFragmentEncoding, value, isCorrectValue)
);
