// Type definitions for ./src/uri.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// clone.!ret

/**
 * summary:
 * 		Use to set multiple URI parts at once.
 *  that: String|Object|null
 * 		URI string or URI object. Current window URI used when null or undefined.
 *  obj: Object
 * 		Available properties: `scheme`, `authority`, `userInfo`, `host`, `port`, `path`, `query`, `fragment`.
 * 		If `authority` property is present, `userInfo`, `host` and `port` are ignored.
 * 		All properties are strings except `query` and `fragment` which may also be objects.
 *  returns: String
 * 		Modified copy of `that`.
 */
declare interface Ret {
}
// resolve.!0

/**
 *
 */
declare interface Uri {

	/**
	 *
	 */
	scheme : string;
}

/**
 *
 * @param query1
 * @param query2
 * @return
 */
declare function equalsQueryStr(query1 : any, query2 : any): boolean;

/**
 *
 * @param uriArr
 * @return
 */
declare function clone(uriArr : string): Ret;

/**
 *
 * @param that
 * @return
 */
declare function param(that : string): /* clone.!ret */ any;

/**
 *
 * @param base
 * @param ref
 */
declare function resolve(base : 0, ref : any): void;

/**
 * @summary Use to set multiple URI parts at once.
 * @return Modified copy of `that`.
 * @param that
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param undefined
 * @param fragment}
 */
declare function mixin(that : any, obj:Uri): void;

/**
 *
 * @param baseStr
 * @param refStr
 * @return
 */
declare function isSubPath(baseStr : any, refStr : any): boolean;
