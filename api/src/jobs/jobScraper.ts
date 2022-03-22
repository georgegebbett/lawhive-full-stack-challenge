import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const getAmpUrl = async (url: string) => {
  try {
    const fullPage = await axios.get(url);
    const fullPageDom = new JSDOM(fullPage.data);

    const document = fullPageDom.window.document;
    const ampUrl = document.querySelector('link[rel="amphtml"]');

    return ampUrl.href;
  } catch (error: any) {
    throw new HttpException(
      'Unable to extract a description from this link',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getDescriptionFromUrl = async (url: string) => {
  // try and get an Amp URL so that we can extract text from a wider range of articles
  const ampUrl = await getAmpUrl(url);
  const ampPage = await axios.get(ampUrl);
  const ampPageDom = new JSDOM(ampPage.data);

  const document = ampPageDom.window.document;
  // BBC specific
  let articleTextNodes = document
    .querySelector('main')
    .querySelectorAll('div[dir="ltr"] > p');

  const articleText = [];

  articleTextNodes.forEach((node) => {
    articleText.push(node.textContent);
  });

  console.log(articleText);

  if (articleText.length === 0) {
    // Fallback for non-BBC articles
    articleTextNodes = document
      .querySelector('main')
      .querySelectorAll('div > p');

    articleTextNodes.forEach((node) => {
      articleText.push(node.textContent);
    });
  }

  if (articleText.length === 0) {
    throw new HttpException(
      'Unable to extract a description from this link',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return articleText.join('\n');
};
