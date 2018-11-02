const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const isUndefined = require('lodash/isUndefined');
const endsWith = require('lodash/endsWith');
const resolveTemplate = require('../resolveTemplate');
const getDestination = require('../getDestination');

const detachFromFile = ({ content, from, at, context, silent }) => {
  if (isUndefined(content)) {
    content = fs.readFileSync(resolveTemplate(from)).toString();
  }
  if (context) {
    content = ejs.render(content, context);
  }
  const dest = path.join(getDestination(), at);
  if (fs.existsSync(dest)) {
    const destContent = fs.readFileSync(dest).toString();
    if (endsWith(destContent, content)) {
      // remove content from the bottom
      fs.truncateSync(dest, destContent.indexOf(content));
      return ['truncate', 'green', at, silent];
    } else {
      // cannot remove content
      return ['not detachable', 'red', at, silent];
    }
  } else {
    // file not exist, how to detach content?
    return ['not exist', 'yellow', at, silent];
  }
};

module.exports = detachFromFile;
