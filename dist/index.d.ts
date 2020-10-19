export = defineKeywords;
/**
 * Defines one or several keywords in ajv instance
 * @param  {Ajv} ajv validator instance
 * @param  {String|Array<String>|undefined} keyword keyword(s) to define
 * @return {Ajv} ajv instance (for chaining)
 */
declare function defineKeywords(ajv: any, keyword: string | Array<string> | undefined): any;
declare namespace defineKeywords {
    export { get };
}
declare function get(keyword: any): any;
