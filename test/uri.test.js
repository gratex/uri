const uri = require('../src/uri');
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

const isSubPathData = [
    [ '/a/b', '/a/b', true ],
    [ '/a/b/c/d', '/a/b', false ],
    [ '/a/b', '/a/b/c/d', true ],
    [ '/a/b/s', '/a/b/d', false ],
    [ '/', '/c/b/d,', true ]
];

test('equalsQueryStr test', (() => {
    function equalsQueryStrTest([ original, expected, value ]) {
        const res = uri.equalsQueryStr(original, expected);
        expect(res).toEqual(value);
    }

    equalsQueryStrData.forEach((item) => equalsQueryStrTest(item));
}));

test('isSubPath test', (() => {
    function isSubPathTest([ base, subbase, expected ]) {
        const res = uri.isSubPath(base, subbase);
        expect(res).toEqual(expected);
    }
    isSubPathData.forEach((item) => isSubPathTest(item));
}));
