import * as prettier from 'prettier';
import * as assert from 'assert';
import * as prettierPluginFluent from './index';

describe('prettier-plugin-fluent', () => {
  it('alphabetizes entries', async () => {
    const code = `
b = Beluga
bad syntax stays with subsequent entry
# comment
a = Abe {$x}
bad syntax at end is preserved
`;

    const pretty = await prettier.format(code, {
      parser: 'fluent-parse' as any,
      plugins: [prettierPluginFluent],
    });

    assert.equal(
      pretty.trim(),
      `
bad syntax stays with subsequent entry
# comment
a = Abe { $x }
b = Beluga
bad syntax at end is preserved
`.trim(),
    );
  });
});
