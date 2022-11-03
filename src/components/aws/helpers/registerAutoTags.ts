import * as pulumi from '@pulumi/pulumi'
import isTaggable from './isTaggable'

/**
 * registerAutoTags adds automatic tags on taggable resources
 *
 * @param autoTags automatic tags
 */
export default function registerAutoTags (
  autoTags: Record<string, string>,
): void {
  pulumi.runtime.registerStackTransformation(args => {
    const resource = args
    if (isTaggable(resource.type)) {
      resource.props.tags = { ...resource.props.tags, ...autoTags }
      return { props: resource.props, opts: resource.opts }
    }
    return undefined
  })
}
