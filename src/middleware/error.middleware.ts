import { NextFunction, Request, Response } from 'express';

class ResponseError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

class ResponseError2 extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const errorMiddleware = async (err: ResponseError | Error, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    next();
    return;
  }

  console.log(err)

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else if (err instanceof ResponseError2) {
    res
      .status(err.status)
      .json({
        errors: JSON.parse(err.message),
      })
      .end();
  } else {
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};

export { ResponseError, ResponseError2, errorMiddleware };
