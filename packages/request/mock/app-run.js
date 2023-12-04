import express from "express";

const ERRORS = {
  0: "请求成功!",
  1: "权限验证失败",
  2: "服务器无响应",
  3: "无法找到资源",
  4: "当前请求数过多",
  5: "连接超时",
  6: "操作异常",
};

export function appRun() {
  return new Promise((res) => {
    const app = express();

    app.use(express.json()); // for parsing application/json
    app.use(express.urlencoded({ extended: true }));

    app.all("*", function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Allow-Methods", "*");
      // res.header('Content-Type', 'application/json;charset=utf-8');
      next();
    });

    app.get("/text", (req, res) => {
      res.send("Hello World!");
    });

    app.get("/user", (req, res) => {
      const code = 0;

      setTimeout(() => {
        res.json({
          code,
          message: ERRORS[code],
          data: {
            name: "lxj",
          },
        });
      }, 2000);
    });

    app.get("/echo", (req, res) => {
      const code = 0;

      res.json({
        code,
        message: ERRORS[code],
        data: req.query,
      });
    });

    app.post("/echo-full", (req, res) => {
      const code = 0;

      res.json({
        code,
        message: ERRORS[code],
        data: {
          query: req.query,
          body: {
            ...req.body,
          },
          headers: req.headers,
        },
      });
    });

    app.get("/error", (req, res) => {
      const code = 6;

      res.status(200).json({
        code,
        message: ERRORS[code],
        data: null,
      });
    });

    app.get("/timeout", (req, res) => {
      const code = 0;

      setTimeout(() => {
        res.status(200).json({
          code,
          message: ERRORS[code],
          data: { type: "timeout" },
        });
      }, 500);
    });

    app.get("/404", (req, res) => {
      res.status(404).send("");
    });

    const server = app.listen(3456, () => {
      res(server);
      console.log("server running on port 3456.");
    });
  });
}
