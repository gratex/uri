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

	/**
	 *
	 */
	scheme : string;
}
// mixin.!1

/**
 *
 */

/**
 *
 */
export declare var CTX : string;

/**
 *
 */
export declare var SVC_CTX_PREFIX : string;

/**
 *
 */
export declare var UI_CTX_PREFIX : string;

/**
 * eslint-disable-next-line no-undef
 */
export declare var DEFAULT_THAT : string;

/**
 * function fromWindow(){} NOT PORTED
 * function navigate(){} NOT PORTED
 * @param conf
 */
declare function config(conf : any): void;

/**
 * paramString window.document.URL instead use '' (or try use '/', or...)
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
declare function clone(uriArr : string | /* clone.!ret */ any): Ret;

/**
 *
 * @param that
 * @return
 */
declare function param(that : string | /* clone.!ret */ any): /* clone.!ret */ any;

/**
 *
 * @param base
 * @param ref
 */
declare function _resolve(base : /* clone.!ret */ any, ref : /* clone.!ret */ any): void;

/**
 *
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
declare function mixin(that : any, param2 : any, param3 : /* userInfo */ any, param4 : /* host */ any, param5 : /* port */ any, param6 : /* scheme */ any, param7 : /* path */ any, param8 : /* query */ any, fragment : any): void;

/**
 *
 * @param baseStr
 * @param refStr
 * @return
 */
declare function isSubPath(baseStr : string, refStr : string): boolean;

/**
 *
 * @param that
 * @return
 */
declare function paramString(that : string): string;

/**
 *
 * @param arr
 * @param what
 * @return
 */
declare function contains(arr : any, what : string): boolean;

/**
 *
 * @param that
 * @return
 */
declare function toString(that : any): any;

/**
 *
 * @param that
 * @return
 */
declare function toUri(that : any): /* clone.!ret */ any;

/**
 *
 * @param that
 * @param toStrip
 */
declare function strip(that : any, toStrip : any): void;

/**
 *
 * @param that1
 * @param that2
 * @param ignoreFragment
 * @return
 */
declare function equals(that1 : any, that2 : any, ignoreFragment : any): any;

/**
 * basic getters
 * @param that
 * @return
 */
declare function getScheme(that : any): string;

/**
 *
 * @param that
 */
declare function getAuthority(that : any): void;

/**
 *
 * @param that
 */
declare function getUserInfo(that : any): void;

/**
 *
 * @param that
 */
declare function getHost(that : any): void;

/**
 *
 * @param that
 */
declare function getPort(that : any): void;

/**
 *
 * @param that
 */
declare function getPath(that : any): void;

/**
 *
 * @param that
 * @param toObject
 */
declare function getQuery(that : any, toObject : any): void;

/**
 *
 * @param that
 */
declare function getFragment(that : any): void;

/**
 *
 * @param that
 */
declare function getSegments(that : any): void;

/**
 * basic setters
 * @param that
 * @param scheme
 */
declare function setScheme(that : any, scheme : any): void;

/**
 *
 * @param that
 * @param authority
 */
declare function setAuthority(that : any, authority : any): void;

/**
 *
 * @param that
 * @param userInfo
 */
declare function setUserInfo(that : any, userInfo : any): void;

/**
 *
 * @param that
 * @param host
 */
declare function setHost(that : any, host : any): void;

/**
 *
 * @param that
 * @param port
 */
declare function setPort(that : any, port : any): void;

/**
 *
 * @param that
 * @param path
 */
declare function setPath(that : any, path : any): void;

/**
 *
 * @param that
 * @param query
 */
declare function setQuery(that : any, query : any): void;

/**
 *
 * @param that
 * @param query
 * @return
 */
declare function appendQuery(that : any, query : any): any;

/**
 *
 * @param that
 * @param fragment
 */
declare function setFragment(that : any, fragment : any): void;

/**
 *
 * @param that
 * @param fragment
 * @return
 */
declare function appendFragment(that : any, fragment : any): any;

/**
 *
 * @param that
 * @param segments
 */
declare function setSegments(that : any, segments : any): void;

/**
 *
 * @param that
 * @param ...appendSegmets
 */
declare function appendSegments(that : any, ...appendSegmets : Array<string>): void;

/**
 * stripping specific parts of URI
 * @param that
 */
declare function stripOrigin(that : any): void;

/**
 *
 * @param that
 */
declare function stripExtension(that : any): void;

/**
 *
 * @param that
 */
declare function stripCtxPath(that : any): void;

/**
 *
 * @param that
 */
declare function stripCtxPrefix(that : any): void;

/**
 *
 * @param that
 */
declare function stripPath(that : any): void;

/**
 *
 * @param that
 */
declare function stripQuery(that : any): void;

/**
 *
 * @param that
 */
declare function stripFragment(that : any): void;

/**
 *
 * @param that
 */
declare function getScreenPath(that : any): void;

/**
 *
 * @param that
 */
declare function getLastSegment(that : any): void;

/**
 * NTH: getLastNonVoidSegment ???
 * @param that
 * @return
 */
declare function denotesFolder(that : any): boolean;

/**
 *
 * @param that
 */
declare function convertToFolder(that : any): void;

/**
 *
 * @param that
 * @param ref
 */
declare function isSubordinate(that : /* clone.!ret */ any, ref : any): void;

/**
 *
 * @param that
 * @param ref
 */
declare function resolve(that : any, ref : any): void;

/**
 *
 * @param that
 * @param ref
 */
declare function resolveAsSubordinate(that : any, ref : any): void;

/**
 *
 * @param that
 * @return
 */
declare function parseId(that : any): number;
