const jsonServer = require("json-server");
const morgan = require("morgan");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const axios = require("axios");

// Create server and router
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee API",
      version: "1.0.0",
      description: "A simple API to manage employees and filter them based on various criteria",
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

// Enable CORS for all routes
server.use(cors());

// Serve the entire db.json on the root path
server.get("/", (req, res) => {
  res.json(router.db.getState());
});

// Custom filtering logic specifically for the /employees route
server.get("/employees", (req, res, next) => {
  let { limit, page, gender, education, company, search } = req.query;
  const db = router.db;

  // Start with the full list of employees
  let employees = db.get("employees");

  // Apply filters based on query parameters
  if (gender) {
    employees = employees.filter(employee => employee.gender.toLowerCase() === gender.toLowerCase());
  }
  if (education) {
    employees = employees.filter(employee => employee.education.toLowerCase() === education.toLowerCase());
  }
  if (company) {
    employees = employees.filter(employee => employee.company.toLowerCase() === company.toLowerCase());
  }
  if (search) {
    const searchLower = search.toLowerCase();
    employees = employees.filter(employee => {
      return Object.values(employee).some(
        value => value && value.toString().toLowerCase().includes(searchLower)
      );
    });
  }

  employees = employees.value();

  // Apply pagination if limit is specified
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


server.get("/health", (req, res) => {
  const logMessage = `🔥 Health endpoint hit at ${new Date().toISOString()} - Status: ok 🚀`;
  console.log(logMessage); // Log the custom message to the server logs
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// const healthCheckUrl = `https://my-json-server-rtt0.onrender.com/health`;

// setInterval(async () => {
//   try {
//     const response = await axios.get(healthCheckUrl);
//     console.log("Health check passed:", response.data);
//   } catch (error) {
//     console.error("Health check failed:", error.message);
//   }
// }, 45000); // 45 seconds


// Use default middlewares for other routes (e.g., /posts, /comments)
server.use(middlewares);

// Use JSON server router for other routes
server.use(router);

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
