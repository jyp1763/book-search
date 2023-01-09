const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");


const resolvers = {
  
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("It looks like you are not logged in");
    },
  },

  Mutation: {
    
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        console.log("no user");
        throw new AuthenticationError(
          "could not find an account with this username"
        );
      }
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        console.log("wrong password");
        throw new AuthenticationError("incorrect password");
      }

      const token = signToken(user);
      return { token, user };
    },
    
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    
    saveBook: async (parent, { newBook }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: newBook } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("It looks like you are not logged in!");
    },

    
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("It looks like you are not logged in!");
    },
  },
};


module.exports = resolvers;