import { CustomRenderingViews } from './CustomRenderingViews';
import {
  CUSTOM_RENDERING_PROPS_SCHEMA_REGISTRY,
  InferCustomRenderingViewProps,
} from './custom-rendering-props-schema-registry';
import { CustomRenderingItem } from './CustomRenderingItem';
import { AdItemErrorCollector, AdItemErrors } from './AdItemErrorCollector';

/**
 * parse custom rendering item from any input like { view, props }
 */
export class CustomRenderingItemParser {
  constructor(private readonly _errorCollector: AdItemErrorCollector) {}

  parse<View extends CustomRenderingViews>(
    view: View,
    props: InferCustomRenderingViewProps<View>
  ): CustomRenderingItem<View>;
  parse(view: unknown, props: unknown): CustomRenderingItem | null;
  parse(view: unknown, props: unknown): CustomRenderingItem | null {
    const parsedView = view as CustomRenderingViews;
    const propsSchema = CUSTOM_RENDERING_PROPS_SCHEMA_REGISTRY[parsedView];

    if (!propsSchema) {
      this._errorCollector.add(AdItemErrors.UNKNOWN_CUSTOM_RENDERING_VIEW);
      return null;
    }

    const propsResult = propsSchema(props);

    if (propsResult.ok) {
      return {
        view: parsedView,
        props: propsResult.value,
      };
    } else {
      this._errorCollector.add(AdItemErrors.INVALID_CUSTOM_RENDERING_PROPS);
      return null;
    }
  }
}
