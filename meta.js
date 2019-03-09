module.exports = {
  helpers: {
    if_or: function(v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
  },
  prompts: {
    completeMessage: `请按以下步骤启动，耐心等待:\n\n  {{^inPlace}}cd {{destDirName}}\n  {{/inPlace}}npm i\n  npm run dev 或者 npm start`
  }
}
