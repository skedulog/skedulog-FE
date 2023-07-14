import { ValidationResult } from "./ValidationResult";

export interface GraphQLError {
    message: string | null | undefined;
    extensions: {
        code: string | null | undefined;
        exception: {
            stacktrace: [string] | null | undefined;
        }
        http: {
            code: string;
            message: string;
            status: number;
            validationResult?: [ValidationResult]
        }
    }
}