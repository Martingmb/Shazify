import { fileResolver } from './graphql/resolvers/fileResolver';
import express from "express";
import bodyparser from "body-parser";
import { MovieResolver } from './graphql/resolvers/movieResolver';
import { connect } from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import fileRoute from "./routes/fileRoute";

const app = express();

app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({extended: true, limit: '50mb'}));
app.use('', fileRoute);

async function prepareServer() {
    const mongoose = await connect("mongodb://localhost:27017/graphql", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [MovieResolver, fileResolver]
        }),
        context: ({req, res}) => ({req, res})
    });

    apolloServer.applyMiddleware({ app, cors: false});

    app.get('/test', (_, response) => {
        response.send({
            status: 201, 
            message: 'HOla mundo'
        });
    });

    app.listen(8080, () => {
        console.log("Listening on port 8080");
    })
} 


prepareServer();
