import pinoHttp from "pino-http";
import { logger } from "./logger.js";

export const httpLogger = pinoHttp.default({
  logger,
  //   customSuccessObject(req, res, loggableObject) {
  //     return {
  //       method: req.method,
  //       url: req.url,
  //       statusCode: res.statusCode,
  //       responseTime: loggableObject.responseTime,
  //       requestId: req.id,
  //     };
  //   },

  //   customErrorObject(req, res, error, loggableObject) {
  //     return {
  //       method: req.method,
  //       url: req.url,
  //       statusCode: res.statusCode,
  //       responseTime: loggableObject.responseTime,
  //       error: error.message,
  //     };
  //   },
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
      };
    },

    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
