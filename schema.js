const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');


// Referee Type
const ReferencesType = new GraphQLObjectType({
    name:'References',
    fields:() => ({
        id: {type:GraphQLString},
        referee: {type: GraphQLString},
        email: {type: GraphQLString},
        rating: {type: GraphQLInt},
        company: {type: GraphQLString},
    })
});

// RootQueryType
const RootQuery= new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        References:{
            type:ReferencesType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
           
                return axios.get('http://localhost:3000/References/'+ args.id)
                    .then(res => res.data);

            }
        },
        References:{
            type: new GraphQLList(ReferencesType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/References')
                    .then(res => res.data);
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addReferences:{
            type:ReferencesType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLInt)},
                referee: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                rating: {type: new GraphQLNonNull(GraphQLInt)},
                company: {type: new GraphQLNonNull(GraphQLString)}
                  
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/References', {
                    referee:args.referee,
                    email: args.email,
                    rating:args.rating
                })
                .then(res => res.data);
            }
        },
        deleteReferences:{
            type:ReferencesType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/References/'+args.id)
                .then(res => res.data);
            }
        },
        editReferences:{
            type:ReferencesType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                referee: {type: GraphQLString},
                email: {type: GraphQLString},
                rating: {type: GraphQLInt},
                company: {type: GraphQLString}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/References/'+args.id, args)
                .then(res => res.data);
            } 
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});