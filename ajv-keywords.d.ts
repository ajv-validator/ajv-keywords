declare module 'ajv-keywords' {
  import { Ajv } from 'ajv';
  
  type AdditionalKeywords =
    | 'typeof'
    | 'instanceof'
    | 'range'
    | 'regexp'
    | 'formatMinimum'
    | 'formatMaximum'
    | 'transform'
    | 'uniqueItemProperties'
    | 'allRequired'
    | 'anyRequired'
    | 'oneRequired'
    | 'patternRequired'
    | 'prohibited'
    | 'deepProperties'
    | 'deepRequired'
    | 'switch'
    | 'select'
    | 'dynamicDefaults'
    ;

  function keywords(ajv: Ajv, include?: AdditionalKeywords | AdditionalKeywords[]): Ajv;

  export = keywords;
}
