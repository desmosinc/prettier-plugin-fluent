import * as prettier from 'prettier';
import * as FTL from '@fluent/syntax';

// A prettier plugin that alphabetizes the entries in an Fluent file

const plugin: prettier.Plugin = {
  languages: [
    {
      name: 'Fluent',
      parsers: ['fluent-parse'],
    },
  ],
  parsers: {
    'fluent-parse': {
      parse(text: string): any {
        return FTL.parse(text, {
          withSpans: true,
        });
      },
      astFormat: 'fluent-ast',
      locStart(node: any) {
        if (!(node instanceof FTL.Span)) {
          return -1;
        }
        return node.start;
      },
      locEnd(node: any) {
        if (!(node instanceof FTL.Span)) {
          return -1;
        }
        return node.end;
      },
    },
  },
  printers: {
    'fluent-ast': {
      print(
        path: prettier.FastPath,
        _options: prettier.ParserOptions,
        _print: (path: prettier.FastPath) => prettier.Doc
      ): prettier.Doc {
        const node: FTL.Resource = path.getValue();

        const entries: {
          id: string;
          entry: FTL.Entry;
          leadingJunk: FTL.Junk[];
        }[] = [];
        let currentJunk: FTL.Junk[] = [];
        for (const item of node.body) {
          if (item instanceof FTL.Junk) {
            currentJunk.push(item);
          } else {
            const entry = item;
            const id =
              entry instanceof FTL.Message || entry instanceof FTL.Term
                ? entry.id.name
                : '';
            entries.push({
              id,
              entry,
              leadingJunk: currentJunk,
            });
            currentJunk = [];
          }
        }

        entries.sort((a, b) => a.id.localeCompare(b.id));

        node.body = [];
        for (const entry of entries) {
          node.body.push(...entry.leadingJunk);
          node.body.push(entry.entry);
        }
        node.body.push(...currentJunk);

        return FTL.serialize(node, {
          withJunk: true,
        });
      },
    },
  },
};

export const { languages, parsers, printers } = plugin;
