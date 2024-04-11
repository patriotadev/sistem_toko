import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


const PrismaErrorHandler = (e: any) => {
    if (e instanceof PrismaClientKnownRequestError) {
            return {
                prismaError: true,
                prismaErrorCode: e.code,
                prismaErrorMeta: e.meta
            }
    }
};

export default PrismaErrorHandler;