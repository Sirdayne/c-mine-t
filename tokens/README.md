In this section we convert `tokens.json` file from our design-token system.

First, we modify tokens data to tailwind acceptable format.

Then convert tailwind acceptable file to `base.tailwind.js` file in /tokens/ root
using style-dictionary and sd-tailwindcss-transformer libraries and list of custom transformers from @tokens-studio/sd-transforms.

After, we remove the nesting of object properties, rename some properties and reorganize some values to tailwind acceptable format.
At the end, this script create `base.tailwind.js` file in project root and delete temporary files.

## using libraries:

token-transformer: https://github.com/tokens-studio/figma-plugin/tree/main/token-transformer
style-dictionary: https://amzn.github.io/style-dictionary/#/
sd-tailwindcss-transformer: https://github.com/nado1001/style-dictionary-tailwindcss-transformer
@tokens-studio/sd-transforms: https://github.com/tokens-studio/sd-transforms
