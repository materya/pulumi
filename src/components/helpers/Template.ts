import { readFileSync } from 'fs'
import { renderString } from 'nunjucks'

export interface TemplateArgs {
  templateFile: string
  valuesMap: { [placeholder: string]: string | boolean }
}

export const template = (args: TemplateArgs): string => (
  renderString(
    readFileSync(args.templateFile).toString(),
    args.valuesMap,
  )
)
