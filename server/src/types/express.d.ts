import 'express-serve-static-core';
import 'qs';

declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    [key: string]: any;
  }
}

declare module 'qs' {
  interface ParsedQs {
    [key: string]: any;
  }
}
