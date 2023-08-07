http://44.204.176.217/graphql   -
here you can see all GraphQL documentation

Completed all points of the test, including JWT authorization, it is based on passing the Authorization parameter, the solutions are pretty bad, I usually use cookies, but this is just a stub
![image](https://github.com/PogunGun/nest-graphQL-blog/assets/76246480/c91c7961-60cc-4777-9a7e-4d4864d1d75b)

Apps built on Nestjs, graphql included for easy testing , set the .env before running the application

Example .env file

# POSTGRES
TYPE_ORM_USERNAME="postgres"
TYPE_ORM_PASS="root"
TYPE_ORM_DATABASE="postgres"
TYPE_ORM_PORT=5432
TYPE_ORM_HOST="postgres"
JWT_SECRET=sqreqweq
JWT_ACCESS_SECRET=JWT_ACCESS_SECRET
JWT_REFRESH_SECRET=JWT_REFRESH_SECRET
POSTGRES_PASSWORD=root
PORT=3000 or your_port

# AFTER INSTALL .ENV
After installing .env, run docker-compose build -> docker-compose up
