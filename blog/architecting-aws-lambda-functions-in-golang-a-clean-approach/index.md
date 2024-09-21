---
slug: architecting-aws-lambda-functions-in-golang-a-clean-approach
title: "Architecting AWS Lambda Functions in Golang: A Clean Approach"
date: 2023-10-09T10:00
tags:
  - architecture
  - go
  - aws
---

Architecting AWS Lambda Functions in Golang: A Clean Approach
=============================================================

![Photo by Lance Anderson on Unsplash](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*JPIgnx-4XbTyZAWn)

Keeping code structure clean when using AWS Lambda can be a bit trickier, since there will be a bunch of entry points in our code. In fact, I usually spend some time finding how to structure my code before starting to code, to achieve “maintainable” and “easy to read” code. In this post, we’ll try out how to use Clean Architecture with AWS Lambda and Go.

<!-- truncate -->

_In_ [_previous post_](http://localhost:3000/blog/unveiling-clean-architecture-guidelines-benefits-and-trade-offs)_, I’ve summarized some concepts of what Clean Architecture is and the pros cons, please check it out if you are keen!_

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*pzzvLDAAirzGOf4scdbI8w.png)

The first purpose of Clean Architecture is “**Independent of Frameworks”** so we will not depend on any framework rule and limitations. In this project, we will use 4 layers to structure our code with Clean Architecture:

## Domains

This layer holds all models / interfaces that will be used across layers. The reason of putting them all together is to avoid potential circular dependency issue, since most of the time a model will be referenced by another model.

For example:

```go title="domain/user.go"
package domain
...
type User struct {
  ID        uint      `json:"id"`
  Name      string    `json:"name"`
  ...
}
type UserRepository interface {
  GetUser(ctx context.Context, id uint) (*User, error)
  ...
}
type UserUsecase interface {
  GetByID(ctx context.Context, id uint) (*User, error)
  ...
}
```

## Repositories

This layer is responsible for communicating with data sources, whether it is Database, another services, or external APIs. There should be no business logic here other than converting data source models to our application models defined in `domain` folder.

This layer should expose general purpose methods regardless what the data source is, for example using `GetUserByEmail` instead of `QueryUserByGSIEmail`. With this in mind, we can easily swap the data source with another data source in the future without nudging the repository interface which is already consumed by another layers.

All repositories will be placed inside each module that represents it. For example:

```go title="user/repository/mysql_repository.go"
package repository
...
type repository struct {
   db *sql.DB
}
func NewMysqlRepository(db *sql.DB) domain.UserRepository {
   return &repository{db}
}
func (m *repository) GetUser(ctx context.Context, id uint) (*domain.User, error) {  
  rows, err := m.db.QueryContext(ctx, "SELECT * FROM user WHERE id = ?", id)  
  ...
}
```

## Use cases

This layer holds the business logic of our application in each related module, it combines the use of some repositories and some conditions to achieve the desired results. This layer should not care about who will consume it, whether it is a REST API, CLI, etc. Thus, no handler specific implementation imports allowed to be here, such as to directly return 400 status code, etc.

This layer should care more about data validation before calling repository layer, and most likely will expose some error codes that can be understood by outer layer if validation fails or something went wrong. This layer really depends on repository layer, so please be aware when making changes to repository layer.

All use cases will be placed inside related module together with their repository dependencies. For example:

```go title="user/usecase/user_usecase.go"
package usecase
...
type usecase struct {
  userRepo domain.UserRepository
}
func NewUsecase(r domain.UserRepository) domain.UserUsecase {
  return &usecase{
    userRepo: r,
  }
}
func (m *usecase) GetByID(ctx context.Context, id uint) (*domain.User, error) {
  ...
  if res == nil {
    return nil, domain.ErrNotFound
  }
  ...
}
```

## Handlers

This is where our application entry point resides, every Lambda handlers for the related module will be defined in this layer. This layer handles request parameters, validates them, pass them to use case layer, and return the result to Lambda function which will then processed by API Gateway.

This layer is responsible for being the interface between user and our system, accept the inputs and return the outputs. In some cases, this layer will need to convert the models to some custom formats.

All handlers will also be placed under the related module directory as repository and use cases does. For example:

```go title="user/handler/user-get/main.go"
package main
...
var (
 db          *sql.DB
 userRepo    domain.UserRepository
 userUsecase domain.UserUsecase
)
func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
  ...
  id, _ := strconv.Atoi(req.PathParameters["id"])
  res, err := userUsecase.GetByID(ctx, id)
  if err != nil {
    return api.APIServerError(err)
  }
  if res == nil {
    return api.ErrResponse(404, "Data not found")
  }
  return api.APIResponse(200, users)
}
func main() {
 db = database.NewMySQLConnection(os.Getenv("DBDataSourceName"))
 userRepo = _userRepo.NewMysqlRepository(db)
 userUsecase = _userUsecase.NewUsecase(userRepo)
 lambda.Start(handler)
}
```

## Conclusion

Finally, we have seen how each layer communicates and one thing we should never forget that _"Source code dependencies can only point inwards"._

To conclude, this is how the directory looks like:

```
.
├── domain                           <-- All domains/entities belong here
├── user                             <-- Module directory
│   └── handler                     
│       └── user-get                 <-- Source code for a lambda function
│           ├── main.go              <-- Lambda function code
│           └── main_test.go         <-- Unit tests
│   └── repository 
│       ├── mysql_repository.go      <-- Repository for our db
│       └── mysql_repository_test.go <-- Unit tests
│   └── usecase 
│       ├── user_usecase.go          <-- Business rules
│       └── user_usecase_test.go     <-- Unit tests
│
├── infra                            <-- All external framework/drivers 
├── utils                            <-- Shared utilities
├── Makefile                         <-- Make to automate build
└── template.yaml                    <-- Cloudformation template
```

As you can see, we can now write unit tests for each layer independently as one of the Clean Architecture purpose is **Testable**! And also if in the future you want to replace Lambda with [Echo](https://echo.labstack.com/) or CLI, it can be done in handler layer level without touching repository/use case layers.

If you are interested, the source code for this post can be found in my repository here https://github.com/yezarela/go-lambda
