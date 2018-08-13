const { uriBuilder, raw, uriBuilderRql } = require('../src/builder');

describe('uri builder test', (() => {
    it('only path parameter', () => {
        const id = '10';
        expect(uriBuilder`/${id}/`).toBe('/10/');
    });

    it('only query', () => {
        const id = '10';
        expect(uriBuilder`?${id}`).toBe('?10');
    });

    it('same parame can be used multile times', () => {
        // usually this means bad url design but still supported by template
        const id = '10';
        expect(uriBuilder`/${id}/?${id}`).toBe('/10/?10');
    });

    it('path query and fragment use DIFFERENT ENCODERS', () => {
        const a = 'x?#';
        expect(uriBuilder`/foo/${a}/?bar=${a}#${a}`).toBe('/foo/x%3F%23/?bar=x?%23#x?%23');
    });

    it('(BEWARE) dot (.) in path is NOT encoded', () => {
        const path = '..';
        expect(uriBuilder`/fixed/${path}`).toBe('/fixed/..');
    });

    it('slash (/) in path IS encoded', () => {
        const path = '../../test';
        expect(uriBuilder`/fixed/${path}`).toBe('/fixed/..%2F..%2Ftest');
    });

    it('backslash (\\) in path IS encoded', () => {
        const path = '..\\..\\test';
        expect(uriBuilder`/fixed/${path}`).toBe('/fixed/..%5C..%5Ctest');
    });

    it('(BEWARE) dot (.) in query is NOT encoded', () => {
        const val = '..';
        expect(uriBuilder`/fixed/?key=${val}`).toBe('/fixed/?key=..');
    });

    it('(BEWARE) slash (/) in query is NOT encoded', () => {
        const val = '../../test';
        expect(uriBuilder`/fixed/?key=${val}`).toBe('/fixed/?key=../../test');
    });

    it('backslash (\\) in query IS encoded', () => {
        const val = '..\\..\\test';
        expect(uriBuilder`/fixed/?key=${val}`).toBe('/fixed/?key=..%5C..%5Ctest');
    });

    it('query param can be already encoded elsewhere, use raw', () => {
        const query = 'a=a&b=b#';
        expect(uriBuilder`/path/?${raw(query)}`).toBe('/path/?a=a&b=b#');
    });

    it('ampersand in SIMPLE value is NOT ENCODED', () => {
        const simple = '&';
        expect(uriBuilder`/test/?${simple}`).toBe('/test/?&');
    });

    // difference from builderRql
    it('Most RQL query control chars "!,:=&/()" in SIMPLE query value are NOT ENCODED', () => {
        const unencoded = '!,:=&/()';
        const encoded = '><|';
        expect(uriBuilder`/foo/?eq(unencoded,${unencoded})&eq(encoded,${encoded})`)
            .toBe('/foo/?eq(unencoded,!,:=&/())&eq(encoded,%3E%3C%7C)');
    });

    it('RQL query control chars are correctly ENCODED using uriBuilderRql', () => {
        const encoded = '=><!,:&|/()';
        expect(uriBuilderRql`/foo/?eq(encoded,${encoded})`)
            .toBe('/foo/?eq(encoded,%3D%3E%3C%21%2C%3A%26%7C%2F%28%29)');
    });

    it('params outside path/query/fragment should throw', () => {
        const foo = 'sk';
        expect(() => uriBuilder`http://www.google.${foo}/test/`)
            .toThrow('Params outside path/query/fragment are unsupported');
        expect(() => uriBuilder`${foo}://${foo}@www.google.com/test/`)
            .toThrow('Params outside path/query/fragment are unsupported');
    });
}));
