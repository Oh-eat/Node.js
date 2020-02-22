module.exports = {
  HTML: (title, list, description, option) => {
    var template = `
      <!DOCTYPE html>
        <html>
          <head>
            <meta charset='utf-8'>
            <link rel="stylesheet" href="style.css">
          </head>
          <body>
            <h1><a href='/'>WEB</a></h1>

            <div id="grid">
              <ol id="list">
                ${list}
              </ol>

              <div id="body">
                ${option}
                <h2>${title}</h2>

                ${description}
              </div>
            </div>
          </body>
        </html>
    `;
    return template;
  }, list: (files) => {
    var list = '';
    for (var index in files){
      if (files[index] !== 'Front'){
        list += `<li><a href='/?id=${files[index]}'>${files[index]}</a></li>\n`
      }
    }
    return list;
  }, link_new: () => {
    var template = `
      <a href='/new' class="func">새로 작성</a>
    `;
    return template;
  }, link_edit: (id) => {
    var template = `
      <a href='/edit?id=${id}' class="func">수정</a>
    `;
    return template;
  }, link_delete: (id) => {
    var template = `
      <form action="/delete_post" method="post">
        <input type="hidden" name="id" value="${id}" class="func">
        <input type="submit" value="삭제">
      </form>
    `;
    return template;
  }
};
