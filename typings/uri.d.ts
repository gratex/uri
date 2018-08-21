// Type definitions for ./src/uri.js
// Project: @gjax/uri

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
 export declare interface UriObj {
     scheme: string;
     host: string;
     port: string;
     userInfo: string;
     authority: string;
     path: string;
     query: string;
     fragment: string;
 }

 export declare interface config {
     CTX: string;
     UI_CTX_PREFIX: string;
     SVC_CTX_PREFIX: string;
 }

export declare const CTX : string;
export declare const SVC_CTX_PREFIX : string;
export declare const UI_CTX_PREFIX : string;
export declare const DEFAULT_THAT : string;

/**
 * function fromWindow(){} NOT PORTED
 * function navigate(){} NOT PORTED
 *
 * @param {config} conf
 */
export declare function config(conf : config): void;

/**
 * paramString window.document.URL instead use '' (or try use '/', or...)
 * @param query1
 * @param query2
 * @return {string}
 */
export declare function equalsQueryStr(query1 : string, query2 : string): boolean;

/**
 *
 * @param {UriObj} uriArr
 * @return {UriObj}
 */
export declare function clone(uriArr : UriObj): UriObj;

/**
 *
 * @param {string | UriObj} that
 * @return {UriObj}
 */
export declare function param(that : string | UriObj): UriObj;

/**
 * @param {string | UriObj | null} that
 * @param {UriObj} obj
 * @return {string}
 */
export declare function mixin(that : string | UriObj | null, obj: UriObj ): string;

/**
 * @param {string} baseStr
 * @param {string} refStr
 * @return {boolean}
 */
export declare function isSubPath(baseStr : string, refStr : string): boolean;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
export declare function paramString(that : string | UriObj | null): string;

/**
 *
 * @param {Array<string>} arr
 * @param {string} what
 * @return {boolean}
 */
export declare function contains(arr : Array<string>, what : string): boolean;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
export declare function toString(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {UriObj}
 */
export declare function toUri(that : string | UriObj | null): UriObj;

/**
 *
 * @param {string | UriObj | null} that
 * @param {string} toStrip
 * @return {string}
 */
export declare function strip(that : string | UriObj | null, toStrip : string): string;

/**
 *
 * @param {string | UriObj | null} that1
 * @param {string | UriObj | null} that2
 * @param {boolean} ignoreFragment
 * @return {boolean}
 */
export declare function equals(that1 : string | UriObj | null, that2 : string | UriObj | null, ignoreFragment : boolean): boolean;

/**
 * basic getters
 * @param {string | UriObj | null} that
 * @return {string}
 */
export declare function getScheme(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
export declare function getAuthority(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
export declare function getUserInfo(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
export declare function getHost(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
export declare function getPort(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string}
 */
export declare function getPath(that : string | UriObj | null): string;

/**
 *
 * @param {string | UriObj | null} that
 * @param {boolean} toObject
 * @return {string | UriObj | undefined}
 */
export declare function getQuery(that : string | UriObj | null, toObject : boolean): string | UriObj | undefined;

/**
 *
 * @param {string | UriObj | null} that
 * @return {string | undefined}
 */
export declare function getFragment(that : string | UriObj | null): string | undefined;

/**
 *
 * @param {string | UriObj | null} that
 * @return {Array<string>}
 */
export declare function getSegments(that : string | UriObj | null): Array<string>;

/**
 * basic setters
 * @param {string | UriObj | null} that
 * @param {string} scheme
 * @return {string}
 */
export declare function setScheme(that : string | UriObj | null, scheme : string): string;

/**
 *
 * @param {string | UriObj | null} that
 * @param {string} authority
 * @return {string}
 */
export declare function setAuthority(that : string | UriObj | null, authority : string): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string} userInfo
 * @return {string}
 */
export declare function setUserInfo(that : string|UriObj|null, userInfo : string): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string} host
 * @return {string}
 */
export declare function setHost(that : string|UriObj|null, host : string): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string} port
 * @return {string}
 */
export declare function setPort(that : string|UriObj|null, port : string): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string} path
 * @return {string}
 */
export declare function setPath(that : string|UriObj|null, path : string): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj} query
 * @return {string}
 */
export declare function setQuery(that : string|UriObj|null, query : string|UriObj): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj} query
 * @return {string}
 */
export declare function appendQuery(that : string|UriObj|null, query : string|UriObj): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj} fragment
 * @return {string}
 */
export declare function setFragment(that : string|UriObj|null, fragment : string|UriObj): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj} fragment
 * @return {string}
 */
export declare function appendFragment(that : string|UriObj|null, fragment : string|UriObj): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {Array<string>} segments
 * @return {string}
 */
export declare function setSegments(that : string|UriObj|null, segments : Array<string>): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {Array<string>}...appendSegmets
 * @return {string}
 */
export declare function appendSegments(that : string|UriObj|null, ...appendSegmets : Array<string>): string;

/**
 * stripping specific parts of URI
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function stripOrigin(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function stripExtension(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function stripCtxPath(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function stripCtxPrefix(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function stripPath(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function stripQuery(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function stripFragment(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function getScreenPath(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function getLastSegment(that : string|UriObj|null): string;

/**
 * NTH: getLastNonVoidSegment ???
 * @param {string|UriObj|null} that
 * @return {boolean}
 */
export declare function denotesFolder(that : string|UriObj|null): boolean;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function convertToFolder(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj|null} ref
 * @return {boolean}
 */
export declare function isSubordinate(that : string|UriObj|null, ref : string|UriObj|null): boolean;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj|null} ref
 * @return {string}
 */
export declare function resolve(that : string|UriObj|null, ref : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @param {string|UriObj|null} ref
 * @return {string}
 */
export declare function resolveAsSubordinate(that : string|UriObj|null, ref : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {number}
 */
export declare function parseId(that : string|UriObj|null): number;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function resolveSvcCtx(that : string|UriObj|null): string;

/**
 *
 * @param {string|UriObj|null} that
 * @return {string}
 */
export declare function resolveUiCtx(that : string|UriObj|null): string;
