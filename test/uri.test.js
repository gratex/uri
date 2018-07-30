const uri = require('../src/uri');
const equalsTestData = [
    [
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose',
        'foo://username:password@my.example.com:8042/over/there/index.x.dtb?type=animal&name=narwhal#nose',
        true
    ],
    [
        'type=animal&name=narwhal',
        'name=narwhal&type=animal',
        true
    ],
    [
        'eq(type,animal)&lt(count,3)',
        'lt(count,3)&eq(type,animal)',
        true
    ],
    [
        'a=1&b=2&a=3',
        'b=2&a=1&a=3',
        true
    ],
    [
        '',
        'b=2&a=1&a=3',
        false
    ],
    [
        'b=3',
        '',
        false
    ],
    [
        'name=foo&name=bar', // order should not be considered
        'name=bar&name=foo',
        true
    ],
    [
        'a=5&a=5',
        'a=5&a=5',
        true
    ],
    [
        'w=42&t=3',
        'w=42&t=4',
        false
    ],
    [
        'type=animal&name=narwhal',
        'name=narwhal&type=animal&typeij=y',
        false
    ]
];

test('_equalsQueryStr test', (() => {
    function equalsQueryStrTest([ original, expected, value ]) {
        const res = uri.equalsQueryStr(original, expected);
        expect(res).toEqual(value);
    }

    equalsTestData.forEach((item) => equalsQueryStrTest(item));
}));
