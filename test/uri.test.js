const Uri = require('../src/uri');
const uri = require('../src/_uri');
const packageJson = require('../package.json');
const TEST_URL = packageJson.jest.testURL;
const TEST_URL_OBJ = uri.decomposeComponents(TEST_URL);
const FULL_URI = 'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose';

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

const equalsData = [
    [ 'http://www.google.sk#w=3', 'http://www.google.sk#w=3', false, true ],
    [ 'http://www.google.sk#w=f', 'http://www.google.sk', true, true ],
    [ 'http://www.google.sk', 'http://www.bar.cz', false, false ],
    [ 'http://www.google.sk?w=f', 'http://www.google.sk?w=f', false, true ],
    [ '/a/b', '/a/b', false, true ],
    [ '/foo/bar?type=animal&name=narwhal', '/foo/bar?name=narwhal&type=animal', false, true ]
];

const getSchemeData = [
    [ null, TEST_URL_OBJ.scheme ],
    [ FULL_URI, 'foo' ],
    [ '/', undefined ],
    [ '', undefined ]
];

const getAuthorityData = [
    [ null, TEST_URL_OBJ.authority ],
    [ FULL_URI, 'username:password@my.example.com:8042' ],
    [ '/', undefined ],
    [ '', undefined ]
];
const getUserInfoData = [
    [ null, undefined ], // TODO parse userinfo fr om location
    [ FULL_URI, 'username:password' ],
    [ '/', undefined ],
    [ '', undefined ]
];
const getHostData = [
    [ null, TEST_URL_OBJ.host ],
    [ FULL_URI, 'my.example.com' ],
    [ '/', undefined ],
    [ '', undefined ]
];
const getPortData = [
    [ null, TEST_URL_OBJ.port ],
    [ FULL_URI, '8042' ],
    [ '/', undefined ],
    [ '', undefined ]
];
const getPathData = [
    [ null, TEST_URL_OBJ.path ], // TEST_URL.OBJ.path ??? ktore
    [ FULL_URI, '/over/there/index.x.dtb' ],
    [ '/', '/' ],
    [ '', '' ]
];
const getQueryData = [
    [ null, TEST_URL_OBJ.query ? TEST_URL_OBJ.query.substr(1) : undefined ],
    [ FULL_URI, 'type=animal&name=narwhal' ],
    [ '/', undefined ],
    [ '', undefined ],
    [ '/abc?', '' ],
    [ [ FULL_URI, true ], { type: 'animal', name: 'narwhal' } ],

    [ [ 'foo://username:password@my.example.com:8042/over/there/index.x.dtb?%EC%96%B8%EC%96%B4=%ED%95%9C%EA%B5%AD%EC%96%B4#nose',
        true ], { 언어: '\uD55C\uAD6D\uC5B4' } ], // 언어 : 한국어	// hangul characters
    [ [ '/abc?no1=123&no2=1236', true ], { no1: '123', no2: '1236' } ],
    [ [ '/abc?no1=123&no2=1236&no1=124', true ], { no1: [ '123', '124' ], no2: '1236' } ],
    [ [ // RQL will not be parsed to object, Uri is unaware of RQL syntax
        '/abc?eq(x,1)&resolved(true)&select(puf)&sort(+a,-b)', true ], {
        'eq(x,1)': undefined,
        'resolved(true)': undefined,
        'select(puf)': undefined,
        'sort(+a,-b)': undefined
    } ],
    // RQL will not be parsed to object, Uri is unaware of RQL syntax
    [ [ '/abc?and(eq(x,1),select(puf),sort(+a,-b))', true ], { 'and(eq(x,1),select(puf),sort(+a,-b))': undefined } ],
    [ [ '/', true ], undefined ],
    [ [ '', true ], undefined ],
    [ [ '/abc?', true ], {} ],

    [ [ '/abc?identity=claimNumber%3D074100009100%3BeventDate%3D2007-07-01T00%3A00%3A00%2B0200%3BpolicyNumber%3D700001642', true ],
        { identity: 'claimNumber=074100009100;eventDate=2007-07-01T00:00:00+0200;policyNumber=700001642' } ]
];
const getFragmentData = [
    [ null, TEST_URL_OBJ.fragment ? TEST_URL_OBJ.fragment.substr(1) : undefined ],
    [ FULL_URI, 'nose' ],
    [ '/', undefined ],
    [ '', undefined ],
    [ '/abc#', '' ]
];

const getSegmentsData = [
    [ FULL_URI, [ 'over', 'there', 'index.x.dtb' ] ],
    [ '/', [ '' ] ],
    [ null, [ 'foo', '' ] ], // see package.json
    [ '', [] ]
];

const setSchemeData = [
    [ [ FULL_URI, null ],
        '//username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, 'http' ],
        'http://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose' ]
];

const setAuthorityData = [
    [ [ FULL_URI, null ],
        'foo:/over/there/index.x.dtb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, 'localhost:8080' ],
        'foo://localhost:8080/over/there/index.x.dtb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, 'jozko:mrkva@localhost:8080' ],
        'foo://jozko:mrkva@localhost:8080/over/there/index.x.dtb?type=animal&name=narwhal#nose' ]
];

const setUserInfoData = [
    [ [ FULL_URI, null ],
        'foo://my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, 'jozko:mrkva' ],
        'foo://jozko:mrkva@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose' ]
];

const setHostData = [
    [ [ FULL_URI, 'localhost' ],
        'foo://username:password@localhost:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose' ]
];

const setPortData = [
    [ [ FULL_URI, null ],
        'foo://username:password@my.example.com/over/there/index.x.dtb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, '8080' ],
        'foo://username:password@my.example.com:8080/over/there/index.x.dtb?type=animal&name=narwhal#nose' ]
];

const setPathData = [
    [ [ FULL_URI, '/a/b/c' ],
        'foo://username:password@my.example.com:8042/a/b/c?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, '/a/%D7%90/c' ],
        'foo://username:password@my.example.com:8042/a/%D7%90/c?type=animal&name=narwhal#nose' ]
];

const setPathErrorData = [
    [ [ FULL_URI, '/a/b?b/c' ], 'Illegal PCHAR sequence:?' ],
    [ [ FULL_URI, '/a/%FF%FF/c' ],
        'Illegal PCHAR sequence:%FF%FF' ]
];

const setQueryData = [
    [ [ FULL_URI, '' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?#nose' ],
    [ [ FULL_URI, null ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb#nose' ],
    [ [ FULL_URI, 'search=newt' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?search=newt#nose' ],
    // 언어 : 한국어 hangul characters
    [ [ '/foo/#nose', { 언어: '\uD55C\uAD6D\uC5B4' } ], '/foo/?%EC%96%B8%EC%96%B4=%ED%95%9C%EA%B5%AD%EC%96%B4#nose' ]
];

const appendQueryData = [
    [ [ FULL_URI, '' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, null ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, 'search=newt' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal&search=newt#nose' ],
    [ [ '/foo/bar/baz', 'search=newt' ], '/foo/bar/baz?search=newt' ],
    [ [ '/foo/bar/baz', { search: 'newt' } ], '/foo/bar/baz?search=newt' ],
    [ [ FULL_URI, { foo: 'bar' } ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal&foo=bar#nose' ]
];

const setFragmentData = [
    [ [ FULL_URI, '' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#' ],
    [ [ FULL_URI, null ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal' ],
    [ [ FULL_URI, 'puf' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#puf' ],
    [ [ FULL_URI, 0 ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#0' ],
    // 언어 : 한국어 hangul characters
    [ [ 'foo/bar/', { 언어: '\uD55C\uAD6D\uC5B4' } ], 'foo/bar/#%EC%96%B8%EC%96%B4=%ED%95%9C%EA%B5%AD%EC%96%B4' ]
];

const appendFragmentData = [
    [ [ FULL_URI, '' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, null ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, 'search=newt' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose&search=newt' ],
    [ [ FULL_URI, { fragment: 'blah' } ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose&fragment=blah' ],
    [ [ '/foo/bar/baz', 'search=newt' ], '/foo/bar/baz#search=newt' ]
];

const appendSegmentsData = [
    [ [ FULL_URI, '' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb/?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, 'aaa' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb/aaa?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, 'aaa', 'bbb' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb/aaa/bbb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, 'aaa', 'bbb', '' ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb/aaa/bbb/?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, [ 'aaa' ] ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb/aaa?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, [ 'aaa', 'bbb' ] ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb/aaa/bbb?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, [ 'aaa', 'bbb', '' ] ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb/aaa/bbb/?type=animal&name=narwhal#nose' ],
    [ [ FULL_URI, [ 'aaa', 'bbb', '', 'ccc' ] ],
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb/aaa/bbb//ccc?type=animal&name=narwhal#nose' ],
    [ [ 'http://www.google.sk', 'bbb' ], 'http://www.google.sk/bbb' ]
];

const stripExtensionData = [
    [ FULL_URI, 'foo://username:password@my.example.com:8042/over/there/index?type=animal&name=narwhal#nose' ],
    [ '/a/b/c.d', '/a/b/c' ],
    [ '/a/b/c.d.f', '/a/b/c' ],
    [ '/a/b/c.d.f/', '/a/b/c.d.f/' ]
];

const stripPathData = [
    [ FULL_URI, 'foo://username:password@my.example.com:8042' ],
    [ '/a/b/c.d', '' ]
];

const stripCtxPathData = [
    [ 'http://www.google.sk/a/b/1/a/ui', '/b/1/a/ui' ],
    [ '/a/d/3/a/ui', '/d/3/a/ui' ],
    [ 'http://www.google.sk/a/b/1/a/svc', '/b/1/a/svc' ],
    [ '/a/d/3/a/svc', '/d/3/a/svc' ]
];

const stripCtxPrefixData = [
    [ '/a/ui/a/b/1', '/a/b/1' ],
    [ '/a/ui/over/there/index.x.dtb?type=animal&name=narwhal#', '/over/there/index.x.dtb?type=animal&name=narwhal#' ],
    [ '/a/svc/a/b/1', '/a/b/1' ],
    [ '/a/svc/over/there/index.x.dtb?type=animal&name=narwhal#', '/over/there/index.x.dtb?type=animal&name=narwhal#' ]
];

const stripCtxPrefixThrowErrorData = [
    'http:/a/b/1',
    'http://localhost/a/b/1',
    'http://localhost:8080/a/b/1',
    '//localhost/a/b/1'
];

const stripCtxThrowErrorData = [
    'http:/x/b/1',
    'http://localhost/x/b/1',
    'http://localhost:8080/x/b/1',
    '//localhost/x/b/1'
];

const stripOriginData = [
    [ FULL_URI, '/over/there/index.x.dtb?type=animal&name=narwhal#nose' ],
    [ '/a/b/c.d', '/a/b/c.d' ]
];

const stripFragmentData = [
    [ FULL_URI, 'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal' ],
    [ 'http://www.google.sk/foo/bar?w=f#p=7', 'http://www.google.sk/foo/bar?w=f' ],
    [ 'http://www.google.sk', 'http://www.google.sk' ]
];

const getLastSegmentData = [
    [ FULL_URI, 'index.x.dtb' ],
    [ '/a/b/c', 'c' ],
    [ '/a/b/c.d', 'c.d' ],
    [ '/a/b/', '' ],
    [ '/', '' ],
    [ '', undefined ]
];
const denotesFolderData = [
    [ FULL_URI, false ],
    [ '/a/b/c', false ],
    [ '/a/b/c.d', false ],
    [ '/a/b/', true ],
    [ '/', true ],
    [ '', false ]
];
const convertToFolderData = [
    [ FULL_URI, 'foo://username:password@my.example.com:8042/over/there/?type=animal&name=narwhal#nose' ],
    [ '/a/b/c', '/a/b/' ],
    [ '/a/b/c.d', '/a/b/' ],
    [ '/a/b/', '/a/b/' ],
    [ '/', '/' ],
    [ '', '/' ]
];

const stripQueryData = [
    [ 'http://www.google.sk', 'http://www.google.sk' ],
    [ 'http://www.kalendar.sk/foo?bar=ba', 'http://www.kalendar.sk/foo' ]
];

const getScreenPathData = [
    [ 'http://www.google.sk/a/ui/this.exe', '/ui/this' ],
    [ 'http://www.google.sk/a/ui/this?que=ry.exe', '/ui/this' ],
    [ 'http://www.google.sk/a/ui/this#foo=bar.exe', '/ui/this' ],
    [ '/a/ui/bar.exe?foo=baz&baz2=foo2', '/ui/bar' ]
];

const parseIdErrorData = [
    [ '/a/b/1/' ],
    [ '/a/b/c' ]
];

const resolveAsSubordinateData = [
    [ 'http:/a/b', '/a/b', 'http:/a/b' ],
    [ 'http:/a/b', '/a/b/c/d', 'http:/a/b/c/d' ],
    [ 'http:/a/b/', '/a/b/c/d', 'http:/a/b/c/d' ],

    [ 'foo://username:password@my.example.com:8042/a/b?type=animal&name=narwhal#nose', '/a/b/c/d',
        'foo://username:password@my.example.com:8042/a/b/c/d' ],

    [ 'foo://username:password@my.example.com:8042/a/b/', 'http://username:password@my.example.com:8042/a/b/c/d',
        'http://username:password@my.example.com:8042/a/b/c/d' ],
    [ '/a/b/', '/a/b/c/d', '/a/b/c/d' ]
];

const resolveAsSubordinateErrorData = [
    [ 'foo://username:password@my.example.com:8042/a/b/', 'http://jozko:mrkva@localhost:8080/a/b/c/d',
        'Assertion failed: IllegalArgument, not subordinate' ], // different authority
    [ 'http:/a/b', '/x/y/c/d', 'Assertion failed: IllegalArgument, not subordinate' ]
];

test.each(equalsQueryStrData)(
    'equalsQueryStrData test: [\'%s\', \'%s\', %p]',
    (original, expected, value) => {
        const res = Uri.equalsQueryStr(original, expected);
        expect(res).toBe(value);
    }
);

test.each(resolveData)(
    'resolve test: [\'%s\', \'%s\', \'%s\']',
    (ref, base, expected) => {
        const res = Uri.resolve(base, ref);
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

describe('strip empty context test', () => {
    beforeAll(() => {
        Uri.config({ CTX: '/', UI_CTX_PREFIX: '/a/ui', SVC_CTX_PREFIX: '/a/svc' });
    });
    test('empty ctx', () => {
        const res = Uri.strip('/', 'CTX');
        expect(res).toBe('');
    });
    afterAll(() => {
        Uri.config({ CTX: '/a', UI_CTX_PREFIX: '/a/ui', SVC_CTX_PREFIX: '/a/svc' });
    });
});

test('strip should throw error when we try to strip CTX_PREFIX that does not exist', (() => {
    expect(() => Uri.strip('/b', 'CTX_PREFIX')).toThrow();
}));

test('toUri test', (() => {
    const res = Uri.toUri('http://www.google.sk');
    expect(res).toEqual({ scheme: 'http', authority: 'www.google.sk', host: 'www.google.sk', path: '' });
}));

test.each(equalsData)(
    'equals test: [%p, %p, %p, %p]',
    (that1, that2, ignoreFragment, expected) => {
        const res = Uri.equals(that1, that2, ignoreFragment);
        expect(res).toBe(expected);
    }
);

describe('basic getters test', (() => {
    test.each(getSchemeData)(
        'getScheme test: [%p, %p]',
        (that, expected) => {
            const res = Uri.getScheme(that);
            expect(res).toBe(expected);
        }
    );
    test.each(getAuthorityData)(
        'getAuthority test: [%p, %p]',
        (that, expected) => {
            const res = Uri.getAuthority(that);
            expect(res).toBe(expected);
        }
    );
    test.each(getUserInfoData)(
        'getUserInfo test: [%p, %p]',
        (that, expected) => {
            const res = Uri.getUserInfo(that);
            expect(res).toBe(expected);
        }
    );
    test.each(getHostData)(
        'getHost test: [%p, %p]',
        (that, expected) => {
            const res = Uri.getHost(that);
            expect(res).toBe(expected);
        }
    );
    test.each(getPortData)(
        'getPort test: [%p, %p]',
        (that, expected) => {
            const res = Uri.getPort(that);
            expect(res).toBe(expected);
        }
    );
    test.each(getPathData)(
        'getPath test: [%p, %p]',
        (that, expected) => {
            const res = Uri.getPath(that);
            expect(res).toBe(expected);
        }
    );
    test.each(getQueryData)(
        'getQuery test: [%p, %p]',
        (p, expected) => {
            if (!Array.isArray(p)) {
                p = [ p ];
            }
            const [ that, toObject ] = p;
            const res = Uri.getQuery(that, toObject);
            expect(res).toEqual(expected);
        }
    );
    test.each(getFragmentData)(
        'getFragment test: [%p, %p]',
        (that, expected) => {
            const res = Uri.getFragment(that);
            expect(res).toBe(expected);
        }
    );
    test.each(getSegmentsData)(
        'getSegmentsData test: [%p, %p]',
        (that, expected) => {
            const res = Uri.getSegments(that);
            expect(res).toEqual(expected);
        }
    );
}));

describe('basic setters test', (() => {
    test.each(setSchemeData)(
        'setScheme test: [%p, %p]',
        ([ original, scheme ], expected) => {
            const res = Uri.setScheme(original, scheme);
            expect(res).toBe(expected);
        }
    );
    test.each(setAuthorityData)(
        'setAuthority test: [%p, %p]',
        ([ original, authority ], expected) => {
            const res = Uri.setAuthority(original, authority);
            expect(res).toBe(expected);
        }
    );
    test.each(setUserInfoData)(
        'setUserInfo test: [%p, %p]',
        ([ original, userInfo ], expected) => {
            const res = Uri.setUserInfo(original, userInfo);
            expect(res).toBe(expected);
        }
    );
    test.each(setHostData)(
        'setHost test: [%p, %p]',
        ([ original, host ], expected) => {
            const res = Uri.setHost(original, host);
            expect(res).toBe(expected);
        }
    );
    test.each(setPortData)(
        'setPort test: [%p, %p]',
        ([ original, port ], expected) => {
            const res = Uri.setPort(original, port);
            expect(res).toBe(expected);
        }
    );
    test.each(setPathData)(
        'setPath test: [%p, %p]',
        ([ original, path ], expected) => {
            const res = Uri.setPath(original, path);
            expect(res).toBe(expected);
        }
    );

    test.each(setPathErrorData)(
        'CheckEncoding should throw error when we pass special characters: [%p, %p, %p]',
        ([ original, path ], expected) => {
            expect(() => Uri.setPath(original, path)).toThrow(expected);
        }
    );

    test.each(setFragmentData)(
        'setFragment test: [%p, %p]',
        ([ original, fragment ], expected) => {
            const res = Uri.setFragment(original, fragment);
            expect(res).toBe(expected);
        }
    );

    test.each(setQueryData)(
        'setQuery test: [%p, %p]',
        ([ original, query ], expected) => {
            const res = Uri.setQuery(original, query);
            expect(res).toBe(expected);
        }
    );

    test.each(appendQueryData)(
        'appendQuery test: [%p, %p]',
        ([ original, query ], expected) => {
            const res = Uri.appendQuery(original, query);
            expect(res).toBe(expected);
        }
    );
    test.each(appendFragmentData)(
        'appendFragment test: [%p, %p]',
        ([ original, fragment ], expected) => {
            const res = Uri.appendFragment(original, fragment);
            expect(res).toBe(expected);
        }
    );
    test.each(appendSegmentsData)(
        'appendSegments test: [%p, %p]',
        ([ original, ...segments ], expected) => {
            const res = Uri.appendSegments(original, ...segments);
            expect(res).toBe(expected);
        }
    );

    test('appendSegments should throw if no segments passed', () => {
        expect(() => Uri.appendSegments('/foo')).toThrow('IllegalArgument, segments argument not present');
    });
}));

test.each(denotesFolderData)(
    'denotesFolder test: [%p, %p]',
    (original, expected) => {
        const res = Uri.denotesFolder(original);
        expect(res).toBe(expected);
    }
);

test.each(convertToFolderData)(
    'convertToFolder test: [%p, %p]',
    (original, expected) => {
        const res = Uri.convertToFolder(original);
        expect(res).toBe(expected);
    }
);

test.each(getLastSegmentData)(
    'getLastSegment test: [%p, %p]',
    (original, expected) => {
        const res = Uri.getLastSegment(original);
        expect(res).toBe(expected);
    }
);

test.each(stripExtensionData)(
    'stripExtension test: [%p, %p]',
    (original, expected) => {
        const res = Uri.stripExtension(original);
        expect(res).toBe(expected);
    }
);

test.each(stripPathData)(
    'stripPath test: [%p, %p]',
    (original, expected) => {
        const res = Uri.stripPath(original);
        expect(res).toBe(expected);
    }
);

test.each(stripOriginData)(
    'stripOrigin test: [%p, %p]',
    (original, expected) => {
        const res = Uri.stripOrigin(original);
        expect(res).toBe(expected);
    }
);

test.each(stripFragmentData)(
    'stripFragment test: [%p, %p]',
    (original, expected) => {
        const res = Uri.stripFragment(original);
        expect(res).toBe(expected);
    }
);

test.each(stripQueryData)(
    'stripQuery test: [%p, %p]',
    (original, expected) => {
        const res = Uri.stripQuery(original);
        expect(res).toBe(expected);
    }
);

test.each(stripCtxPrefixData)(
    'stripCtxPrefix test: [%p, %p]',
    (original, expected) => {
        const res = Uri.stripCtxPrefix(original);
        expect(res).toBe(expected);
    }
);

test.each(stripCtxPrefixThrowErrorData)(
    'stripCtx should throw error when we try to strip CTX_PREFIX that does not exist',
    (original) => {
        expect(() => Uri.stripCtxPrefix(original)).toThrow('IllegalArgument, context prefix not present');
    }
);

test.each(stripCtxThrowErrorData)(
    'stripCtx should throw error when we try to strip CTX_PREFIX that does not exist',
    (original) => {
        expect(() => Uri.stripCtxPath(original)).toThrow('IllegalArgument, context not present');
    }
);

test.each(stripCtxPathData)(
    'stripCtxPath test: [%p, %p]',
    (original, expected) => {
        const res = Uri.stripCtxPath(original);
        expect(res).toBe(expected);
    }
);

test.each(getScreenPathData)(
    'getScreenPath test: [%p, %p]',
    (original, expected) => {
        const res = Uri.getScreenPath(original);
        expect(res).toBe(expected);
    }
);

describe('parseId test', (() => {
    test('parseId should return correct id', (() => {
        const res = Uri.parseId('/a/b/3');
        expect(res).toBe(3);
    }));

    test.each(parseIdErrorData)(
        'Should throw error because id can be only number: %p',
        (original) => {
            expect(() => Uri.parseId(original)).toThrow();
        }
    );
}));

test.each(resolveAsSubordinateData)(
    'resolveAsSubordinate test: [%p, %p]',
    (original, ref, expected) => {
        const res = Uri.resolveAsSubordinate(original, ref);
        expect(res).toBe(expected);
    }
);

test.each(resolveAsSubordinateErrorData)(
    'Throws error if not subordinate',
    (original, ref) => {
        expect(() => Uri.resolveAsSubordinate(original, ref)).toThrow('IllegalArgument, not subordinate');
    }
);

test('resolveUiCtx', () => {
    expect(Uri.resolveUiCtx('/foo')).toBe('/a/ui/foo');
    expect(Uri.resolveUiCtx('/a/ui/foo')).toBe('/a/ui/foo');
    expect(() => Uri.resolveUiCtx('http://a.b.c/foo')).toThrow();
});

test('resolvesvcCtx', () => {
    expect(Uri.resolveSvcCtx('/foo')).toBe('/a/svc/foo');
    expect(Uri.resolveSvcCtx('/a/svc/foo')).toBe('/a/svc/foo');
    expect(() => Uri.resolveSvcCtx('http://a.b.c/foo')).toThrow();
});

describe('strip empty context test', () => {
    beforeAll(() => {
        Uri.config({ CTX: '/', UI_CTX_PREFIX: null, SVC_CTX_PREFIX: null });
    });
    test('empty ctx', () => {
        expect(() => Uri.resolveUiCtx('http://a.b.c/foo')).toThrow();
        expect(() => Uri.resolveSvcCtx('http://a.b.c/foo')).toThrow();
    });
    afterAll(() => {
        Uri.config({ CTX: '/a', UI_CTX_PREFIX: '/a/ui', SVC_CTX_PREFIX: '/a/svc' });
    });
});
