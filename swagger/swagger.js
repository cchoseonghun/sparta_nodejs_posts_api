const swaggerAutogen = require('swagger-autogen')({ language: 'ko' });

const doc = {
  info: {
    title: "Node.js 입문 주차 개인 과제 API",
    description: "Node.js와 Express로 로그인 기능 없는 백엔드 서버 만들기",
  },
  host: "http://3.34.196.250",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "../app.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);