import type { Response } from "express";

interface ResponseData {
  message?: string;
  code?: string;
  [key: string]: any;
}

const ResponseSuccess = (
  res: Response,
  data: ResponseData,
  statusCode = 200
) => {
  const { message = "SUCCESS", code: responseCode, ...restData } = data;

  res.status(statusCode).json({
    code: responseCode || `ODSC-${statusCode}`,
    message,
    data: restData,
  });
};

const ResponsePaginationSuccess = (
  res: Response,
  data: any,
  page: number,
  limit: number,
  total: number,
  statusCode = 200
) => {
  const totalPages = Math.ceil(total / limit);

  res.status(statusCode).json({
    code: `ODSC-${statusCode}`,
    message: "SUCCESS",
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
};

export { ResponseSuccess, ResponsePaginationSuccess };
