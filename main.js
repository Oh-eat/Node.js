var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var path = require('path');
//var s_html = require('sanitize-html');
var Template = require('./lib/template.js')

var app = http.createServer((req, res) => {
  //console.log(req.url);
  var _url = url.parse(req.url, true);
  var _query = _url.query;
  var _id = _query.id;
  if (_id !== undefined){_id = path.parse(_id).base;};
  var _pathname = _url.pathname;
  if (_pathname === '/'){
    if (_id === undefined){
      var _title = 'Front';
      var _edit_link = '';
      var _del_link = '';
    } else {
      var _title = _id;
      var _edit_link = Template.link_edit(_id);
      var _del_link = Template.link_delete(_id);
    };
    fs.readdir('data', (err, files) => {
      fs.readFile(`data/${_title}`, (err, _description) => {
        var _list = Template.list(files);
        var template = Template.HTML(_title, _list, _description, Template.link_new() + _edit_link + _del_link);
        // var template = Template.HTML(s_html(_title, {allowedTags: ['p', 'strong']}), _list, s_html(_description, {allowedTags: ['p', 'strong']}), Template.link_new() + _edit_link + _del_link);
        res.writeHead(200);
        res.end(template);
      });
    });
  } else if (_pathname === '/new'){
    fs.readdir('data', (err, files) => {
      var _title = '새로 작성';
      var _list = Template.list(files);
      var _description = `
        <form action="/new_post" method="post">
          <p>
            <input type="text" name="title" placeholder="제목">
          </p>
          <p>
            <textarea name="description" placeholder="본문"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `
      var template = Template.HTML(_title, _list, _description, '')
      res.writeHead(200);
      res.end(template);
    });
  } else if (_pathname === '/new_post'){
    var _parse = '';
    req.on('data', (data) => {
      _parse += data;
    });
    req.on('end', () => {
      var _post = qs.parse(_parse);
      //var _id = s_html(_post.title, {allowedTags: ['p', 'strong']});
      //var _description = s_html(_post.description, {allowedTags: ['p', 'strong']});
      var _id = _post.title;
      var _description = _post.description;
      fs.writeFile(`data/${_id}`, _description, 'utf-8', (err) => {
        res.writeHead(302, {Location: `/?id=${_id}`});
        res.end();
      });
    });
  } else if (_pathname === '/edit'){
    fs.readdir('data', (err, files) => {
      fs.readFile(`data/${_id}`, (err, _description2) => {
        var _title = _id;
        var _list = Template.list(files);
        var _description = `
          <form action="/edit_post" method="post">
            <p>
              <input type="hidden" name="id" value="${_id}">
            </p>
            <p>
              <input type="text" name="title" placeholder="제목" value="${_id}">
            </p>
            <p>
              <textarea name="description" placeholder="본문">${_description2}</textarea>
            </p>
            <p>
              <input type="submit" name="submit">
            </p>
          </form>
        `
        var template = Template.HTML(_title, _list, _description, Template.link_new());
        res.writeHead(200);
        res.end(template);
      });
    });
  } else if (_pathname === '/edit_post'){
    var _parse = '';
    req.on('data', (data) => {
      _parse += data;
    });
    req.on('end', () => {
      var _post = qs.parse(_parse);
      var _id = _post.id;
      var _title = _post.title;
      var _description = _post.description;
      if (_id !== _title){
        fs.rename(`data/${_id}`, `data/${_title}`, (err) => {
          fs.writeFile(`data/${_title}`, _description, 'utf-8', (err) => {
            res.writeHead(302, {Location: `/?id=${_title}`});
            res.end();
          })
        })
      } else {
        fs.writeFile(`data/${_title}`, _description, 'utf-8', (err) => {
          res.writeHead(302, {Location: `/?id=${_title}`});
          res.end();
        })
      }
    });
  } else if (_pathname === '/delete_post'){
    var _parse = '';
    req.on('data', (data) => {
      _parse += data;
    });
    req.on('end', () => {
      var _post = qs.parse(_parse);
      var _id = _post.id;
      fs.unlink(`data/${_id}`, (err) => {
        res.writeHead(302, {Location: '/'});
        res.end();
      });
      // fs.mkdir('deleted', (err) => {
      //   fs.rename(`data/${_id}`, `deleted/${_id}`, (err) => {
        // });
      // });
    });
  } else if (_pathname === '/style.css') {
    fs.readFile('style.css', (err, description) => {
      res.writeHead(200);
      res.end(description);
    });
  } else {
    res.writeHead(404);
    res.end(
      `
      <body style="font-size: 40px; padding-left: 30px; background-color: black; color: white;"><h1>404 Not Found</h1><p><img style="width: 60%" src="https://www.desktophut.ru/wp-content/uploads/2018/09/girls-frontline.jpg"></img></p></body>
      `
    );
  };
});

app.listen(3000);
