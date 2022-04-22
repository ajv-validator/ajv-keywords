import type {KeywordDefinition} from "ajv"
import type {Transformation} from "./transform"

export interface DefinitionOptions {
  defaultMeta?: string | boolean
}

export interface KeywordOptions {
  /**
   * Modifications to the "transform" keyword
   */
  transform?: {
    /**
     * Override existing transformations or add additional (new)
     * @example // overrides existing "trim" transformation, if "trim" didn't exist, it would have been added
     *   import { trim } from "@example-org/pkgName/example-trim"
     *
     *   customTransformations: {
     *     trim: {
     *       transformation: trim,
     *       modulePath: "@example-org/pkgName/example-trim",
     *     }
     *   }
     *
     *   // module "example.trim.ts" ("@example-org/pkgName/example-trim") exports a function "trim"
     *   export const trim = (value: string) => value.trim()
     * @end
     */
    customTransformations?: {
      [key: string]: {
        transformation: Transformation
        modulePath: string
      }
    }
  }
}
export type KeywordsWithCustomization = keyof KeywordOptions

export type GetDefinition<T extends KeywordDefinition> = (opts?: DefinitionOptions) => T
