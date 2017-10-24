# mutationExample
Example of how to mutate data in GraphQL

Setting up the environment:

Install the latest version of Node: https://nodejs.org/en/download/

Install the latest version of GIT or GITbash: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

File system:

Create a folder and you'll need two JSON files and two Javascript file inside as follows. 

Steps:

1.In the terminal run NPM init - you'll create a package.json file. Complete the fields, ensuring the entry point matches your main .js filename. Mine's Server.js


2. Run: npm install express express-graphql graphql --save [Enter]
        json-server axios --save [Enter]
        nodemon --save [Enter]

3. Create a server.js file with...

const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js');

const app = express();

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}));

app.listen(4000, () => {
    console.log('Server is running on port 4000..');
});


4. Add the following scripts to your package.json file:

"dev:server": "nodemon server.js",
"json:server": "json-server --watch data.json",
"start": "node server.js"


5. Test you're up and running by running that script in your terminal:

npm run dev:server

Port 4000 should be listening out for you.


6. Create a new file called: schema.js and build out your schema. Making sure you define all the types you'd like to use. Then building out the schema that you will use to query in GraphiQL including your resolvers.


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
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
    });


7. Create a Data.json file for the information we will be querying from GraphiQL. Here's the mock data I'm using. 


{
  "References": [
    {
      "id": "1",
      "referee": "Shooter McGavin",
      "email": "shooter@gmail.com",
      "rating": 9,
      "company": "Augusta National"
    },
    {
      "id": "2",
      "referee": "Bill Gates",
      "email": "outthegates@gmail.com",
      "rating": 4,
      "company": "Microsoft"
    },
    {
      "id": "3",
      "referee": "Linus Torvalds",
      "email": "Lin@linux.com",
      "rating": 6,
      "company": "Linux"
    },
    {
      "id": "4",
      "referee": "Santoshi Nakamoto",
      "email": "santoshi@gmail.com",
      "rating": 7,
      "company": "Bitcoin"
    },
    {
      "id": "5",
      "referee": "Charlie Lee",
      "email": "clee@gmail.com",
      "rating": 4,
      "company": "Coinbase"
    },
    {
      "id": "6",
      "referee": "Guido van Rossum",
      "email": "python@py.com",
      "rating": 8,
      "company": "Google"
    },
    {
      "id": "7",
      "referee": "Vitalik Buterin",
      "email": "VickyB@ethereum.com",
      "rating": 6,
      "company": "Ethereum"
    }
  ]
}


8. Create a new terminal keeping your old one running. In this new terminal window run the second script we created in the Package.json file. Input: npm run json:server.


9. Open your browser and check the JSON Server is running on: http://localhost:3000/


10. Build out the get request & promise (.then) to collect your data from your JSON server:


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
                    

11.  Create an add References type and resolver.

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


12. We can now test out the mutation functionaility we've built to get data and add data in GraphiQL. Make sure your two servers are still running then navigate to port 4000 in your browser adding GraphQL (http://localhost:4000/graphql).

Try variations of the following schema in the GraphiQL interface then hit play. 

{
  References{
    id, 
    referee, 
    email,
    company
  }
}

This schema above should bring up a list of the refereces you have in your data.json file.
Try the below to add new references.


mutation{
  addReferences(id: 8, referee: "Mr New Guy", email:"newguy@him.com", rating: 5, company: "New Block"){
    id,
    referee,
    email,
  
  }
}

When you hit play you will see new referees appear in your data.json file.


13. Try and add a delete References Type in that is similar to the last but removing the args. 


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
        
        
 14. Navigate back to GraphiQL and try to delete the customer you have created just using the ID. Using syntax like this..
 
 
 mutation{
  deleteReferences(id: "Bk-CV52T-"){
    id
  }
  }
  
  You should see referees being deleted from your data.json file as you pass in the relevant ID's.
  
  
 15. Our final mutation is to edit the data. Create another type and resolver similair to the last. Ensuring only the ID is non null so you just need this information to change any field.
 
 
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
 
 

16. Back to GraphiQL and try out your last mutation. Try the following query syntax to change your referees rating.


mutation{
  editReferences(id: "1", rating: 7){
    id,
    referee,
    rating
  }
}


You should now see in the response and the data.json file that the rating has changed! These are your mutations!.

Please see to add changes and get in let me know if you have any questions. 


