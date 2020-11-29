import Ajv, {Options} from "ajv/dist/2019"
import AjvPack from "ajv/dist/standalone/instance"

export default function ajvPack(opts: Options = {}): Ajv {
  opts.code ||= {}
  opts.code.source = true
  return (new AjvPack(new Ajv(opts)) as unknown) as Ajv
}
