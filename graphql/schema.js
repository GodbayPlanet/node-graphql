const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = require("graphql");

const {
  getTwitterUser,
  getTwitterUserFollowers
} = require("../model/TwitterUser");

const TwitterUser = new GraphQLObjectType({
  name: "TwitterUser",
  fields: () => ({
    name: { type: GraphQLString },
    screen_name: { type: GraphQLString },
    description: { type: GraphQLString },
    followers_count: { type: GraphQLInt },
    following: {
      type: new GraphQLList(TwitterUser),
      resolve(root, args) {
        return getTwitterUserFollowers(root.screen_name).then(
          data => data.followers
        );
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    twitter_user: {
      type: TwitterUser,
      args: { screen_name: { type: GraphQLString } },
      resolve(_, args) {
        return getTwitterUser(args.screen_name).then(data => data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
