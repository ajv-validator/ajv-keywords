import Ajv from "ajv"
import AjvPack from "ajv/dist/standalone/instance"

export default function ajvPack(): Ajv {
  return (new AjvPack(new Ajv({code: {source: true}})) as unknown) as Ajv
}
