import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Boolean, Int, Float, ID

//Demo Data
const users = [
	{
		id: '1',
		name: 'Sumanth',
		email: 'sumanthtatipamula999@gmail.com',
	},
	{
		id: '2',
		name: 'Sarah',
		email: 'sarah@example.com',
	},
	{
		id: '3',
		name: 'Mike',
		email: 'mike@gmail.com',
	},
];

const posts = [
	{
		id: '10',
		title: 'GraphQL 101',
		body: 'This is how to use GraphQL...',
		published: true,
		author: '1',
	},
	{
		id: '11',
		title: 'GraphQL 201',
		body: 'This is an advanced GraphQL post...',
		published: false,
		author: '1',
	},
	{
		id: '12',
		title: 'Programming Music',
		body: '',
		published: false,
		author: '3',
	},
];

const comments = [
	{
		id: '102',
		text: 'This worked well for me. Thanks!',
		author: '1',
		post: '10',
	},
	{
		id: '103',
		text: 'Glad you enjoyed it.',
		author: '1',
		post: '10',
	},
	{
		id: '104',
		text: 'This did no work.',
		author: '2',
		post: '11',
	},
	{
		id: '105',
		text: 'Nevermind. I got it to work.',
		author: '3',
		post: '12',
	},
];

// Type Definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
        me: User!
        post: Post!
        add(nums: [Float!]!): Float!
        grades: [Int!]!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment{
        id: String!
        text: String!
        author: User!
        post: Post!
    }
`;

// Resolvers
const resolvers = {
	Query: {
		greeting(parent, args, context) {
			if (args.name) return `Hello, ${args.name}!`;
			return `Hello!`;
		},
		me() {
			return {
				id: `123`,
				name: `Sumanth Tatipamula`,
				email: `sumanthtatipamula999@gmail.com`,
				age: 24,
			};
		},
		grades(parent, args, context, info) {
			return [99, 80, 93];
		},
		post() {
			return {
				id: `abc123`,
				title: 'Intro to GraphQL',
				body: '',
				published: false,
			};
		},
		add(parent, { nums }, context) {
			return nums.reduce((acc, curr) => acc + curr, 0);
		},
		users(parent, args, context, info) {
			if (!!args.query) {
				return users.filter((user) =>
					user.name.toLowerCase().includes(args.query.toLowerCase())
				);
			}
			return users;
		},
		posts(parent, args, context, info) {
			if (!!args.query) {
				return posts.filter((post) => {
					return (
						post.body.toLowerCase().includes(args.query.toLowerCase()) ||
						post.title.toLowerCase().includes(args.query.toLowerCase())
					);
				});
			}
			return posts;
		},
		comments(parent, args, context, info) {
			return comments;
		},
	},
	Post: {
		author(parent, args, context, info) {
			return users.filter((user) => user.id === parent.author)[0];
		},
		comments(parent, args, context, info) {
			return comments.filter((Comment) => Comment.post === parent.id);
		},
	},
	User: {
		posts(parent, args, context, info) {
			return posts.filter((post) => post.author === parent.id);
		},
		comments(parent, args, context, info) {
			return comments.filter((Comment) => Comment.author === parent.id);
		},
	},
	Comment: {
		author(parent, args, context, info) {
			return users.filter((user) => user.id === parent.author)[0];
		},
		post(parent, args, context, info) {
			return posts.find((post) => post.id === parent.post);
		},
	},
};

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => {
	console.log(`The server is up!`);
});
