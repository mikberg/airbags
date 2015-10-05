import {expect} from 'chai';
import markdown from '../../src/extractors/markdown';

const exampleFile = `\
---
title: Test
tags:
 - cool
 - awesome
---
Content
`;

describe('Extractor: markdown', () => {
  it('throws if not given a string', () => {
    expect(() => markdown()).to.throw();
  });

  it('accepts an empty string', () => {
    expect(() => markdown('')).not.to.throw();
  });

  it('returns an object with field `html`', () => {
    expect(markdown('')).to.include.keys('html');
  });

  it('transforms markdown to HTML', () => {
    expect(markdown(`I **am** *cool*`).html)
        .to.contain('<strong>am</strong>');
  });

  it('returns an object with field `meta`', () => {
    expect(markdown('')).to.include.keys('meta');
  });

  it('should parse YAML front matter', () => {
    expect(markdown(exampleFile).meta)
        .to.deep.equal({ title: 'Test', tags: ['cool', 'awesome'] });
  });

  it('should not include font matter in HTML output', () => {
    expect(markdown(exampleFile).html).to.equal('<p>Content</p>\n');
  });
});
