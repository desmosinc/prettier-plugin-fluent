import * as prettier from 'prettier';
import * as assert from 'assert';

describe('prettier-plugin-fluent', () => {
  it('alphabetizes entries', () => {
    const code = `
b = Beluga
bad syntax stays with subsequent entry
# comment
a = Abe {$x}
bad syntax at end is preserved
`;

    const pretty = prettier.format(code, {
      parser: 'fluent-parse' as any,
      plugins: ['.'],
    });

    assert.equal(
      pretty.trim(),
      `
bad syntax stays with subsequent entry
# comment
a = Abe { $x }
b = Beluga
bad syntax at end is preserved
`.trim()
    );
  });
});
