import scripts from '../scripts';

module.exports = (req, res, next) => {
  const request = req;

  scripts.getScript(request.storage, 'styles')
    .then(script => {
      if (script) {
        const data = script();
        request.custom_style = { title: data.title, css: data.css };
      }

      return next();
    })
    .catch(err => next(err));
};
