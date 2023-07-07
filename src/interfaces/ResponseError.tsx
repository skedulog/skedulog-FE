import { GraphQLError } from "./GraphQLError";

export interface ResponseError {
    graphQLErrors: [GraphQLError];
    networkError: any;
    forward: Function;
    operation: any;
}