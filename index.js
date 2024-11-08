const jsonServer = require("json-server");
const morgan = require("morgan");  // For logging HTTP requests
const server = jsonServer.create();
const router = jsonServer.router("db.json"); // Use db.json as the database
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080; // Port to run the server

// Use Morgan middleware to log HTTP requests in 'dev' format
server.use(morgan('dev'));

// Custom middleware to handle query parameters for filtering and pagination
server.use((req, res, next) => {
  let { limit, page, gender, education, company, search } = req.query;
  const db = router.db; // Access the lowdb database

  let employees = db.get("employees");

  // Debugging: log query parameters
  console.log("Query Parameters:", req.query);

  // Apply gender filter
  if (gender) {
    employees = employees.filter(employee => employee.gender.toLowerCase() === gender.toLowerCase());
    console.log("Filtered by gender:", gender);
  }

  // Apply education filter
  if (education) {
    employees = employees.filter(employee => employee.education.toLowerCase() === education.toLowerCase());
    console.log("Filtered by education:", education);
  }

  // Apply company filter
  if (company) {
    employees = employees.filter(employee => employee.company.toLowerCase() === company.toLowerCase());
    console.log("Filtered by company:", company);
  }

  // Apply search filter (search across all fields in employee)
  if (search) {
    const searchLower = search.toLowerCase();
    employees = employees.filter(employee => {
      return Object.values(employee).some(value =>
        value && value.toString().toLowerCase().includes(searchLower)
      );
    });
    console.log("Filtered by search:", search);
  }

  // Debugging: log filtered employees after all filters
  console.log("Filtered Employees:", employees);

  // Apply pagination: limit and page
  if (limit) {
    const limitNumber = parseInt(limit, 10); // Convert limit to number
    const pageNumber = parseInt(page, 10) || 1; // Default to page 1 if page is not provided
    const startIndex = (pageNumber - 1) * limitNumber; // Calculate start index
    const endIndex = startIndex + limitNumber; // Calculate end index

    // Ensure we have a valid range for slicing the employees array
    employees = employees.slice(startIndex, endIndex); // Slice the employees array
    console.log(`Paginated Employees (Page ${pageNumber}):`, employees);
  }

  // Final data to be returned
  res.locals.data = employees; // Store the final result in `res.locals`
  
  // Debugging: log the final response before passing it to the next middleware
  console.log("Final Response Data:", employees);

  next(); // Pass control to the next middleware or router
});

server.use(middlewares);
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
