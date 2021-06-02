//настройки только для dev
module.exports = function( sourceDir ) {
  return {
    devServer: {
      //stats: 'errors-only',
      stats: 'detailed',
    }
  };
};
