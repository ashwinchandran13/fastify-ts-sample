import fastify from "fastify";
import { Static, Type } from '@sinclair/typebox';
import addFormats from 'ajv-formats';
import Ajv from "ajv";

// Validation
const ajv = addFormats(new Ajv(), [
    'email',
]).addKeyword('kind')
  .addKeyword('modifier')

const server = fastify();

// Schemas

const User = Type.Object({
    name: Type.String(),
    mail: Type.Optional(Type.String({ format: "email" })),
});
type UserType = Static<typeof User>

//Generics

interface IQuerystring {
    username: string;
    password: string;
}

interface IHeaders {
    'h-Custom': string;
}

server.get('/ping', async (request, reply) => {
    return 'pong\n';
})

// using interface

server.get<{
    Querystring: IQuerystring,
    Headers: IHeaders
}>('/auth', {
    preValidation: (request, reply, done) => {
        const { username, password } = request.query;
        done(username !== 'admin' ? new Error('Must be admin') : undefined)
    }
}, async (request, reply) => {
    const customHeader = request.headers['h-Custom'];

    return `logged in`
});

// Using JSON schema

server.post<{ Body: UserType; Response: UserType }>(
    "/items",
    {
        schema: {
            body: User,
            response: {
                200: User,
            },
        },
    },
    (req, rep) => {
        const { body: user } = req;
        console.log(user);
        
        // const { name, mail } = user;
        // let items: UserType[] = [];
        // const item = {
        //     name,
        //     mail
        // }
        // items = [...items, item];
        // const isValid = ajv.validate(User, user);
        // console.log(isValid);
        
        rep.status(200).send(user);
    }
);

server.listen(8080, (err, address) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(`Server listen at ${address}`);
})