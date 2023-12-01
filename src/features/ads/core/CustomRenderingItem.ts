import { type InferCustomRenderingViewProps } from './custom-rendering-props-schema-registry';

/**
 * custom rendering view within props
 */
export interface CustomRenderingItem<View = string> {
  readonly view: View;
  readonly props: InferCustomRenderingViewProps<View>;
}
