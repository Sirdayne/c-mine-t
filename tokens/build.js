/* eslint @typescript-eslint/no-var-requires: 0 */
/* eslint no-undef: 0 */
const StyleDictionaryModule = require('style-dictionary');
const { makeSdTailwindConfig } = require('sd-tailwindcss-transformer');
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const { transformTokens } = require('token-transformer');
const fs = require('fs');

const tokens = require('./tokens.json');
const transformerOptions = {
  expandTypography: true,
  expandShadow: true,
  expandComposition: true,
  expandBorder: true,
  preserveRawValue: true,
  throwErrorWhenNotResolved: false,
  resolveReferences: true,
};

const keys = [
  'core',
  'themes/ct-light',
  'device/desktop',
  'device/tablet',
  'device/mobile',
  'localization-fonts/latin',
];
const core = transformTokens(tokens, keys, [], transformerOptions);
fs.writeFileSync('tokens/core.json', JSON.stringify(core));

registerTransforms(StyleDictionaryModule);

function percentageToDecimal(value) {
  if (!`${value}`.endsWith('%')) {
    return `${value}`;
  }
  const percentValue = `${value}`.slice(0, -1);
  const numberValue = parseFloat(percentValue);
  return numberValue / 100;
}
function transformLineHeight(value) {
  if (value === undefined) {
    return value;
  }
  const decimal = percentageToDecimal(value);
  return typeof decimal === 'string' || isNaN(decimal) ? `${value}px` : `${decimal}`;
}

StyleDictionaryModule.registerTransform({
  name: 'custom/size/lineheight',
  type: 'value',
  matcher: (token) => token.type === 'lineHeights',
  transformer: (token) => transformLineHeight(token.value),
});

const config = makeSdTailwindConfig({
  type: 'base',
  source: ['./tokens/core.json'],
  transforms: [
    'ts/descriptionToComment',
    'ts/size/px',
    'ts/opacity',
    'custom/size/lineheight',
    'ts/type/fontWeight',
    'ts/resolveMath',
    'ts/size/css/letterspacing',
    'ts/typography/css/shorthand',
    'ts/border/css/shorthand',
    'ts/shadow/css/shorthand',
    'ts/color/css/hexrgba',
    'ts/color/modifiers',
    'name/cti/kebab',
    'attribute/cti',
  ],
  buildPath: './tokens/',
  tailwind: {
    content: ['./src/**/*.{js,ts,vue}'],
  },
});

const StyleDictionary = StyleDictionaryModule.extend(config);

StyleDictionary.buildAllPlatforms();

const build = require('./base.tailwind');
const result = {};
const withoutNesting = ['spacing', 'borderRadius', 'lineHeight'];
const ignoringProps = ['size', 'paragraphSpacing', 'textCase', 'textDecoration'];

function concatenateNames(string, parent) {
  if (!parent.length) {
    return string;
  }
  return parent + string.slice(0, 1).toUpperCase() + string.slice(1);
}

const replacePropName = (name) => {
  return name.replace('color', 'colors');
};
const replaceValues = (key, value, target, saveParentName) => {
  for (let [propKey, propValue] of Object.entries(value)) {
    if (propValue instanceof Object) {
      replaceValues(propKey, propValue, target, saveParentName);
    } else {
      if (saveParentName) {
        const name = concatenateNames(propKey, key);
        target[name] = propValue;
      } else {
        target[propKey] = propValue;
      }
    }
  }
};
const handleBoxShadow = (values, target) => {
  for (let [key, value] of Object.entries(values)) {
    target[key] = Object.values(value).map((val) => `${val.x} ${val.y} ${val.blur} ${val.spread} ${val.color}`);
  }
};
const handleTypography = (value, target, name = '') => {
  for (let [propKey, propValue] of Object.entries(value)) {
    if (propValue instanceof Object) {
      const flatName = concatenateNames(propKey, name);
      if (propValue.fontSize) {
        target[flatName] = [
          propValue.fontSize,
          {
            lineHeight: `${propValue.lineHeight}`.endsWith('%') ? propValue.lineHeight : `${propValue.lineHeight}px`,

            letterSpacing: propValue.letterSpacing,
            fontWeight: propValue.fontWeight,
          },
        ];
      } else {
        handleTypography(propValue, target, flatName);
      }
    }
  }
};

function iterate(obj, target) {
  for (let [key, value] of Object.entries(obj)) {
    if (value instanceof Object) {
      if (ignoringProps.includes(key)) {
        continue;
      }
      const transformedKey = replacePropName(key);

      if (!target[transformedKey]) {
        target[transformedKey] = {};
      }
      if (withoutNesting.includes(key)) {
        replaceValues(transformedKey, value, target[transformedKey], transformedKey !== 'spacing');
        continue;
      }
      if (transformedKey === 'boxShadow') {
        handleBoxShadow(value, target[transformedKey]);
        continue;
      }
      if (transformedKey === 'typography') {
        handleTypography(value, target['fontSize']);
        if (target['typography']) {
          delete target['typography'];
        }
        continue;
      }
      iterate(value, target[transformedKey], key);
    } else {
      target[key] = value;
    }
  }
}

iterate(build, result);

const unquoteFromKeys = (json, type = '') => {
  const joinSpace = (value, type, space = ' '.repeat(4)) => {
    if (type !== 'all') {
      return value;
    }
    return space + value;
  };
  const result = json.replace(/"(\\[^]|[^\\"])*"\s*:?/g, (match) => {
    if (/[0-9]/.test(match) && /[a-zA-Z]/.test(match)) {
      return match;
    }
    if (/:$/.test(match)) {
      return joinSpace(match.replace(/^"|"(?=\s*:$)/g, ''), type);
    }
    return match;
  });
  return result.replace(/}/g, (match) => joinSpace(match, type));
};

const data = `// eslint-disable-next-line no-undef \n module.exports = ${unquoteFromKeys(
  JSON.stringify(result, null, '  '),
  'base'
)}\n`;
fs.writeFileSync('base.tailwind.js', data);
fs.unlinkSync('./tokens/core.json');
fs.unlinkSync('./tokens/base.tailwind.js');

console.log('All jobs successfully done.');
