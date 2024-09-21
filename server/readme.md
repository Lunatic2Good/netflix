npx prisma db push
mpx prisma studio

<!-- remove 6453 from database url if not working correctly -->
to run server - npm run start:dev
to run client - npm run dev


client library
-useForm
-universal cookie
-@reduxjs/toolkit
-react-redux

for payments use-
-stripe

<!-- now make sure ------------------------------>
<!-- 1. user not authenticated -> goes to plans page -> redirected to login page -->
<!-- 2. user is authenticated and has a plan -> goes to plans page -> redirected to manage page -->
<!-- 3. user is authenticated and has no plan -> goes to plans page -> redirected to plans page -->
<!-- 4. user is authenticated and has no plan -> goes to browse or watch page -> redirected to plans page -->
<!-- 5. user is authenticated and has basic plan -> goes to browse or watch page -> allowed access -->
<!-- 6. user is authenticated and has basic plan -> goes to watch southpark page -> redirected to manage page -->