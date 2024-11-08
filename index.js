const jsonServer = require("json-server");
const morgan = require("morgan");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080;
const cors = require("cors");

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee API",
      version: "1.0.0",
      description:
        "A simple API to manage employees and filter them based on various criteria",
    },
    servers: [
      {
        url: `https://my-json-server-rtt0.onrender.com`, // Live server URL
      },
      {
        url: `http://localhost:${port}`, // Local server URL
      },
    ],
  },
  apis: ["annotation.js"], // Path to the file containing API annotations
};

// Initialize Swagger
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Setup middleware for Swagger UI
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use Morgan for logging
server.use(morgan("dev"));

server.use(cors()); // Enable CORS for all routes

// Custom filtering logic based on query parameters
server.use((req, res, next) => {
  let { limit, page, gender, education, company, search } = req.query;
  const db = router.db;

  let employees = db.get("employees");

  if (gender) {
    employees = employees.filter(
      (employee) => employee.gender.toLowerCase() === gender.toLowerCase()
    );
  }

  if (education) {
    employees = employees.filter(
      (employee) => employee.education.toLowerCase() === education.toLowerCase()
    );
  }

  if (company) {
    employees = employees.filter(
      (employee) => employee.company.toLowerCase() === company.toLowerCase()
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    employees = employees.filter((employee) => {
      return Object.values(employee).some(
        (value) => value && value.toString().toLowerCase().includes(searchLower)
      );
    });
  }

  employees = employees.value();

  if (limit) {
    const limitNumber = parseInt(limit, 10);
    const pageNumber = parseInt(page, 10) || 1;
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    employees = employees.slice(startIndex, endIndex);
  }

  res.locals.data = employees;

  res.json(employees);
});

// Use default middlewares (e.g., for CORS, security, etc.)
server.use(middlewares);

// Use JSON server router
server.use(router);

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
