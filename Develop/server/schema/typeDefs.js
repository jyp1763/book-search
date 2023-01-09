const { gql } =require('apollo-server-express');

const typeDefs = gql`
type Book {
    authors: [String]
    description: String!
    bookId: ID!
    image: String
    link: String
    title: String
}

type User{
    _id:ID!
    username: String!
    email: String!
    savedBooks: [Book]
    bookCount: Int    
}
type Auth {
    token: ID!
    user: User
  }
  type Query {
    me: User
  }
  input NewBook {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(newBook: NewBook!): User
    removeBook(bookId: ID!): User
  }
`;
module.exports = typeDefs;
