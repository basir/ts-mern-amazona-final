# TypeScript MERN AMAZONA

![amazona](/frontend/public/images/amazona.jpg)

## TypeScript React Tutorial - Build ECommerce in 6 Hours [2023]

Welcome to my React and Node tutorial to build a fully-functional e-commerce website exactly like amazon. Open your code editor and follow me for the next hours to build an e-commerce website using MERN stack (MongoDB, ExpressJS, React and Node.JS).

Watch it on Youtube:
[https://www.youtube.com/watch?v=CDtPMR5y0QU](https://www.youtube.com/watch?v=CDtPMR5y0QU)

## Demo Website

- 👉 Render : [https://amazona.onrender.com](https://amazona.onrender.com)

## You Will Learn

- HTML5 and CSS3: Semantic Elements, CSS Grid, Flexbox
- React: Components, Props, Events, Hooks, Router, Axios
- Context API: Store, Reducers, Actions
- Node & Express: Web API, Body Parser, File Upload, JWT
- MongoDB: Mongoose, Aggregation
- Development: ESLint, Babel, Git, Github,
- Deployment: Heroku

## Run Locally

### 1. Clone repo

```shell
     git clone git@github.com:basir/mern-amazona.git
     cd mern-amazona
```

### 2. Create .env File

- duplicate .env.example in backend folder and rename it to .env

### 3. Setup MongoDB

- Local MongoDB
  - Install it from [here](https://www.mongodb.com/try/download/community)
  - In .env file update MONGODB_URI=mongodb://localhost/amazona
- OR Atlas Cloud MongoDB
  - Create database at [https://cloud.mongodb.com](https://cloud.mongodb.com)
  - In .env file update MONGODB_URI=mongodb+srv://your-db-connection

### 4. Run Backend

```shell
 cd backend
 npm install
 npm start
```

### 5. Run Frontend

```shell
# open new terminal
$ cd frontend
$ npm install
$ npm start
```

### 6. Seed Users and Products

- Run this on browser: <http://localhost:5000/api/seed>
- It returns admin email and password and 6 sample products

### 7. Admin Login

- Run <http://localhost:3000/signin>
- Enter admin email and password and click signin

## Support

- Contact Instructor: [Basir](mailto:basir.jafarzadeh@gmail.com)

## Lessons

1. Create Product and Rating Component
   1. create Rating component
   2. Create Product component
   3. Use Rating component in Product component
2. Create Product Details Page
   1. fetch product from backend
   2. create 3 columns for image, info and action
3. Create Loading and Message Component
   1. create loading component
   2. use spinner component
   3. craete message component
   4. create utils.js to define getError fuction
4. Create React Context For Add Item To Cart
   1. Create React Context
   2. define reducer
   3. create store provider
   4. implement add to cart button click handler
5. Complete Add To Cart
   1. check exist item in the cart
   2. check count in stock in backend
6. Create Cart Page
   1. create 2 columns
   2. display items list
   3. create action column
7. Complete Cart Page
   1. click handler for inc/dec item
   2. click handler for remove item
   3. click handler for checkout
8. Create Signin Page
   1. create sign in form
   2. add email and password
   3. add signin button
9. Connect To MongoDB Database
   1. create atlas monogodb database
   2. install local mongodb database
   3. npm install mongoose
   4. connect to mongodb database
10. Seed Sample Products
    1. create Product model
    2. create seed route
    3. use route in server.js
    4. seed sample product
11. Seed Sample Users
    1. create user model
    2. seed sample users
12. Create Signin Backend API
    1. create signin api
    2. npm install jsonwebtoken
    3. define generateToken
13. Complete Signin Page
    1. handle submit action
    2. save token in store and local storage
    3. show user name in header
14. Create Shipping Page
    1. create form inputs
    2. handle save shipping address
    3. add checkout wizard bar
15. Create Sign Up Page
    1. create input forms
    2. handle submit
    3. create backend api
16. Implement Select Payment Method Page
    1. create input forms
    2. handle submit
17. Create Place Order Page
    1. show cart items, payment and address
    2. calculate order summary
18. Implement Place Order Action
    1. handle place order action
    2. create order create api
19. Create Order Page
    1. create backend api for order/:id
    2. fetch order api in frontend
    3. show order information in 2 cloumns
20. Pay Order By PayPal
    1. generate paypal client id
    2. create api to return client id
    3. install react-paypal-js
    4. use PayPalScriptProvider in index.js
    5. use usePayPalScriptReducer in Order Page
    6. implement loadPaypalScript function
    7. render paypal button
    8. implement onApprove payment function
    9. create pay order api in backend
21. Display Order History
    1. create order Page
    2. create order history api
    3. use api in the frontend
22. Create Profile Page
    1. get user info from context
    2. show user information
    3. create user update api
    4. update user info
23. Publish To Heroku
    1. create and config node project
    2. serve build folder in frontend folder
    3. Create heroku account
    4. connect it to github
    5. Create mongodb atlas database
    6. Set database connection in heroku env variables
    7. Commit and push
24. Add Sidebar and Search Box
    1. add sidebar
    2. add search box
25. Create Search Page
    1. show filters
    2. create api for searching products
    3. display results
26. Create Admin Menu
    1. define protected route component
    2. define admin route component
    3. add menu for admin in header
27. Create Dashboard Page
    1. create dashboard ui
    2. implement backend api
    3. connect ui to backend
28. Manage Products
    1. create products list ui
    2. implement backend api
    3. fetch data
29. Create Product
    1. create products button
    2. implement backend api
    3. handle on click
30. Create Edit Product
    1. create edit button
    2. create edit product ui
    3. dispaly product info in the input boxes
31. Implement Update Product
    1. create edit product backend api
    2. handle update click
32. Upload Product Image
    1. create cloudinary account
    2. use the api key in env file
    3. handle upload file
    4. implement backend api to upload
33. Delete Product
    1. show delete button
    2. implement backend api
    3. handle on click
34. List Orders
    1. create order list Page
    2. implement backen api
    3. fetch and display orders
35. Deliver Order
    1. add deliver button
    2. handle click action
    3. implement backen api for deliver
36. Delete Order
    1. add delete button
    2. handle click action
    3. implement backen api for delete
37. List Users
    1. create user list Page
    2. implement backen api
    3. fetch and display users
38. Edit User
    1. create edit button
    2. create edit product ui
    3. dispaly product info in the input boxes
    4. implement backend api
    5. handle edit click
39. Delete User
    1. add delete button
    2. handle click action
    3. implement backen api for delete
40. Choose Address On Google Map
    1. create google map credentials
    2. update .env file with Google Api Key
    3. create api to send google api to frontend
    4. create map Page
    5. fetch google api
    6. getUserLocation
    7. install @react-google-maps/api
    8. use it in shipping Page
    9. apply map to the checkout Page
41. Email order receipt by mailgun
    1. create mailgun account
    2. add and verify your domain to mailgun
    3. install mailgun-js
    4. set api key in env file
    5. change pay order in orderRouter
    6. send email order receipt
42. Review Products
    1. create submit review form
    2. handle submit
    3. implement backend api for review
43. Upload multiple Images
    1. add images to product model
    2. get images in edit Page
    3. show images in product Page
44. Upgrade To React 18
    1. install node-check-updates
    2. ncu -u
    3. remove package-lock.json
    4. npm install
    5. replace render with createRoot
    6. fix LinkContainer error
