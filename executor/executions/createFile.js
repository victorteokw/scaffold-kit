const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const ejs = require('ejs');
const isUndefined = require('lodash/isUndefined');
const resolveTemplate = require('../resolveTemplate');
const getDestination = require('../getDestination');

const createFile = ({ content, from, at, context, silent, overwrite }) => {
  if (isUndefined(content)) {
    content = fs.readFileSync(resolveTemplate(from)).toString();
  }
  if (context) {
    content = ejs.render(content, context);
  }
  const dest = path.join(getDestination(), at);
  if (fs.existsSync(dest)) {
    const destContent = fs.readFileSync(dest).toString();
    if (destContent === content) {
      // never mind, same content
      return ['up-to-date', 'yellow', at, silent];
    } else {
      if (overwrite) {
        // overwrite
        fs.writeFileSync(dest, content);
        return ['overwrite', 'green', at, silent];
      } else {
        // jsut errors
        return ['exist', 'red', at, silent];
      }
    }
  } else {
    // create file
    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(dest, content);
    return ['create', 'green', at, silent];
  }

};

module.exports = createFile;
