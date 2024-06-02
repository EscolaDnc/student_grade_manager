import http from "http";
import { v4 } from "uuid";

const port = 3000;
const grades = [];

const server = http.createServer((request, response) => {
  const { method, url } = request;
  let body = "";

  request.on("data", (chunk) => {
    body += chunk.toString();
  });

  request.on("end", () => {
    const id = url.split("/")[2];

    if (url === "/grades" && method === "GET") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(grades));
    } else if (url === "/grades" && method === "POST") {
      const { studentName, subject, grade } = JSON.parse(body);
      const newGrade = { id: v4(), studentName, subject, grade };
      grades.push(newGrade);
      response.writeHead(201, { "Content-Type": "application/json" });
      response.end(JSON.stringify(newGrade));
    } else if (url.startsWith("/grades/") && method === "PUT") {
      const { studentName, subject, grade } = JSON.parse(body);
      const gradeToUpdate = grades.find((g) => g.id === id);
      if (gradeToUpdate) {
        gradeToUpdate.studentName = studentName;
        gradeToUpdate.subject = subject;
        gradeToUpdate.grade = grade;
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(gradeToUpdate));
      } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Grade not found" }));
      }
    } else if (url.startsWith("/grades/") && method === "DELETE") {
      const index = grades.findIndex((g) => g.id === id);

      if (index !== -1) {
        grades.splice(index, 1);
        response.writeHead(204);
        response.end();
      } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Grade not found" }));
      }
    } else {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "Route not found" }));
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
