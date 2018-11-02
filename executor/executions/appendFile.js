const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const ejs = require('ejs');
const isUndefined = require('lodash/isUndefined');
const endsWith = require('lodash/endsWith');
const resolveTemplate = require('../resolveTemplate');
const getDestination = require('../getDestination');

const appendFile = ({ content, from, at, context, silent }) => {
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
      // never mind, don't need to append anymore
      return ['up-to-date', 'yellow', at, silent];
    } else {
      // do the append
      fs.appendFileSync(dest, content);
      return ['append', 'green', at, silent];
    }
  } else {
    // create file
    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(dest, content);
    return ['create', 'green', at, silent];
  }
};

module.exports = appendFile;
