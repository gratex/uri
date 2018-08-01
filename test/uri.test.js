const Uri = require('../src/uri');
const uri = require('../src/_uri');
const packageJson = require('../package.json');
const TEST_URL = packageJson.jest.testURL;
// const fullUri = 'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose';

Uri.config({ CTX: '/a', UI_CTX_PREFIX: '/a/ui', SVC_CTX_PREFIX: '/a/svc' });

const equalsQueryStrData = [
    [ 'type=animal&name=narwhal', 'name=narwhal&type=animal', true ],
    [ 'eq(type,animal)&lt(count,3)', 'lt(count,3)&eq(type,animal)', true ],
    [ 'a=1&b=2&a=3', 'b=2&a=1&a=3', true ],
    [ '', 'b=2&a=1&a=3', false ],
    [ 'b=3', '', false ],
    [ 'name=foo&name=bar', 'name=bar&name=foo', true ], // order should not be considered
    [ 'a=5&a=5', 'a=5&a=5', true ],
    [ 'w=42&t=3', 'w=42&t=4', false ],
    [ 'type=animal&name=narwhal', 'name=narwhal&type=animal&typeij=y', false ]
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
    [ './../^g*', 'http:', 'http:^g*' ],
    [ './../^g*', '', '^g*' ]
];

const mixinData = [
    [ '/g?j=l', { path: '/o' }, '/o?j=l' ],
    [ '/g?j=l', { authority: 'john.doe@www.example.com' }, '//john.doe@www.example.com/g?j=l' ],
    [ '//jozo@www.google.sk:8080/g?j=l', { authority: null }, '/g?j=l' ],
    [ '//jozo@www.google.sk:8080/g?j=l', { host: 'seznam.cz' }, '//jozo@seznam.cz:8080/g?j=l' ],
    [ 'http://jozo@k.sk:80/g?j=l#ah',
        { scheme: 'https', authority: 'j@afoj.sk:78', path: '/t', query: 'w=f', fragment: '7' }, 'https://j@afoj.sk:78/t?w=f#7' ],
    [ 'http://jozo@k.sk:80/g?j=l#ah',
        { scheme: 'https', host: 'afoj.sk', port: '78', userInfo: 'j', path: '/t', query: { w: '5' }, fragment: { s: '7' } },
        'https://j@afoj.sk:78/t?w=5#s=7' ],
    [ null, { query: 'a=b' }, `${TEST_URL}?a=b` ],
    [ { scheme: 'http', authority: 'www.google.sk', host: 'www.google.sk', path: '' }, { host: 'www.afoj.sk' },
        'http://www.afoj.sk' ]
];

const isSubPathData = [
    [ '/a/b', '/a/b', true ],
    [ '/a/b/c/d', '/a/b', false ],
    [ '/a/b', '/a/b/c/d', true ],
    [ '/a/b/s', '/a/b/d', false ],
    [ '/', '/c/b/d,', true ]
];

const toStringData = [
    [ null, TEST_URL ],
    [ { scheme: 'http', authority: 'www.google.sk', host: 'www.google.sk', path: '' }, 'http://www.google.sk' ],
    [ 'http://www.google.sk/foo/bar', 'http://www.google.sk/foo/bar' ],
    [ { path: '/foo/bar', query: 'w=f', fragment: 'x=s' }, '/foo/bar?w=f#x=s' ]
];

const stripData = [
    [ 'http://www.google.sk/foo', 'QUERY,PATH,FRAGMENT', 'http://www.google.sk' ], // not existing parts are ignored
    [ 'http://www.google.sk/foo.bar', 'EXTENSION', 'http://www.google.sk/foo' ],
    [ 'http://www.google.sk', 'EXTENSION', 'http://www.google.sk' ], // striping extension without path
    [ 'http://www.google.sk/foo', 'EXTENSION', 'http://www.google.sk/foo' ], // striping extension with path but no ext
    [ '/a/ui/c/d/', 'CTX', '/ui/c/d/' ], // see config of CTXs on the top
    [ '/a/ui/c/d/', 'CTX_PREFIX', '/c/d/' ],
    [ '/a/svc/c/d/', 'CTX_PREFIX', '/c/d/' ],
    [ 'http://www.google.sk/foo/bar?w=f#p=7', 'ORIGIN', '/foo/bar?w=f#p=7' ],
    [ 'http://www.google.sk/foo/bar?w=f#p=7', 'PATH,FRAGMENT', 'http://www.google.sk?w=f' ],
    [ 'http://www.google.sk/foo/bar?w=f#p=7', 'QUERY', 'http://www.google.sk/foo/bar#p=7' ]
];

test.each(equalsQueryStrData)(
    'equalsQueryStrData test: [\'%s\', \'%s\', %p]',
    (original, expected, value) => {
        const res = Uri.equalsQueryStr(original, expected);
        expect(res).toBe(value);
    }
);

test.each(isSubPathData)(
    'isSubPath test: [\'%s\', \'%s\', %p]',
    (base, subbase, expected) => {
        const res = Uri.isSubPath(base, subbase);
        expect(res).toBe(expected);
    }
);

test.each(resolveData)(
    'resolve test: [\'%s\', \'%s\', \'%s\']',
    (ref, base, expected) => {
        const res = uri.recomposeComponents(Uri.resolve(uri.decomposeComponents(base), uri.decomposeComponents(ref)));
        expect(res).toBe(expected);
    }
);

test.each(mixinData)(
    'mixin test: [%p, %p, %p]',
    (that, obj, expected) => {
        const res = Uri.mixin(that, obj);
        expect(res).toBe(expected);
    }
);

test.each(toStringData)(
    'toString test: [%p, %p]',
    (that, expected) => {
        const res = Uri.toString(that);
        expect(res).toBe(expected);
    }
);

test.each(stripData)(
    'strip test: [%p, %p, %p]',
    (that, toStrip, expected) => {
        const res = Uri.strip(that, toStrip);
        expect(res).toBe(expected);
    }
);

test('strip should throw error when we try to strip CTX_PREFIX that does not exist', (() => {
    expect(() => Uri.strip('/b', 'CTX_PREFIX')).toThrow();
}));

test('toUri test', (() => {
    const res = Uri.toUri('http://www.google.sk');
    expect(res).toEqual({ scheme: 'http', authority: 'www.google.sk', host: 'www.google.sk', path: '' });
}));
