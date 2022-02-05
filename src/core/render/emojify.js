import emojiData from './emojify-data.js';

function replaceEmojiShorthand(m, $1, useNativeEmoji) {
  const emojiMatch = emojiData.data[$1];

  let result = m;

  if (emojiMatch) {
    if (useNativeEmoji) {
      const emojiUnicode = emojiMatch
        .replace('unicode/', '')
        .split('-')
        .map(u => `&#x${u};`)
        .join('')
        .concat('&#xFE0E;');
      result = `<span class="emoji">${emojiUnicode}</span>`;
    } else {
      result = `<img src="${emojiData.baseURL}${emojiMatch}.png" alt="${$1}" class="emoji" loading="lazy">`;
    }
  }

  return result;
}

export function emojify(text, useNativeEmoji) {
  return (
    text
      // Mark colons in tags
      .replace(
        /<(code|pre|script|template)[^>]*?>[\s\S]+?<\/(code|pre|script|template)>/g,
        m => m.replace(/:/g, '__colon__')
      )
      // Mark colons in comments
      .replace(/<!--[\s\S]+?-->/g, m => m.replace(/:/g, '__colon__'))
      // Replace emoji shorthand codes
      .replace(/:([\w\-+]+?):/g, (m, $1) =>
        replaceEmojiShorthand(m, $1, useNativeEmoji)
      )
      // Restore colons in tags and comments
      .replace(/__colon__/g, ':')
  );
}
