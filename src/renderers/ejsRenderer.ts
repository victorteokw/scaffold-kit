function ejsRenderer(content: string, context: object): string {
  const ejs = require('ejs');
  return ejs.render(content, context);
}

export default ejsRenderer;
