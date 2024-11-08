/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Retrieve a list of employees
 *     description: Get a list of employees with optional query filters (limit, page, gender, education, company, search).
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of results to return.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to fetch.
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: The gender of the employees to filter.
 *       - in: query
 *         name: education
 *         schema:
 *           type: string
 *         description: The education level of the employees to filter.
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: The company name of the employees to filter.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter employees based on any field.
 *     responses:
 *       200:
 *         description: A list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   firstName:
 *                     type: string
 *                     example: "Brinn"
 *                   lastName:
 *                     type: string
 *                     example: "Jephcote"
 *                   email:
 *                     type: string
 *                     example: "bjephcote0@archive.org"
 *                   dob:
 *                     type: string
 *                     format: date-time
 *                     example: "1981-10-05T12:09:39Z"
 *                   gender:
 *                     type: string
 *                     example: "Female"
 *                   education:
 *                     type: string
 *                     example: "Graduate"
 *                   company:
 *                     type: string
 *                     example: "Gabspot"
 *                   experience:
 *                     type: integer
 *                     example: 36
 *                   package:
 *                     type: integer
 *                     example: 37
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
