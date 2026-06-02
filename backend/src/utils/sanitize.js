const sanitizeHtml = require('sanitize-html');

function sanitizeRichText(input) {
  return sanitizeHtml(input || '', {
    allowedTags: ['b', 'i', 'em', 'strong', 'u', 'p', 'ul', 'ol', 'li', 'br', 'span'],
    allowedAttributes: {
      span: ['style']
    },
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-fA-F]{3,6}$/],
        'font-weight': [/^\d+$/]
      }
    }
  });
}

module.exports = {
  sanitizeRichText
};
