import ErrorModel from "@/models/error/errorModel";
import * as HttpUtility from "./httpClient";

interface Response<T> {
  data: T;
  headers: Record<string, string>;
}

function restModelCreator<T>(
  Model: new (data: T) => T,
  response: Response<T> | ErrorModel
): { payload: T | T[]; metadata: Record<string, string> } | ErrorModel {
  if (response instanceof ErrorModel) {
    return response;
  }
  return {
    payload: !Array.isArray(response.data)
      ? new Model(response.data)
      : response.data.map((json: T) => new Model(json)),
    metadata: response.headers,
  };
}

export async function getToModel<T>(
  Model: new (data: T) => T,
  endpoint: string,
  params?: Record<string, string>,
  requestConfig?: Record<string, string>,
  isAuthenticated?: boolean
): Promise<
  { payload: T | T[]; metadata: Record<string, string> } | ErrorModel
> {
  const response = await HttpUtility.get(
    endpoint,
    params,
    requestConfig,
    isAuthenticated
  );
  return restModelCreator(Model, response);
}

export async function delToModel<T>(
  Model: new (data: any) => T,
  endpoint: string,
  data?: any,
  isAuthenticated?: boolean
): Promise<{ payload: T | T[]; metadata: Record<string, any> } | ErrorModel> {
  const response = await HttpUtility.del(endpoint, isAuthenticated, data);
  return restModelCreator(Model, response);
}

export async function postToModel<T>(
  Model: new (data: T) => T,
  endpoint: string,
  data?: T,
  requestConfig?: Record<string, string>,
  isAuthenticated?: boolean
): Promise<
  { payload: T | T[]; metadata: Record<string, string> } | ErrorModel
> {
  const response = await HttpUtility.post(
    endpoint,
    data,
    requestConfig,
    isAuthenticated
  );
  return restModelCreator(Model, response);
}

export async function putToModel<T>(
  Model: new (data: any) => T,
  endpoint: string,
  data?: any,
  requestConfig?: Record<string, any>,
  isAuthenticated?: boolean
): Promise<{ payload: T | T[]; metadata: Record<string, any> } | ErrorModel> {
  const response = await HttpUtility.put(
    endpoint,
    data,
    requestConfig,
    isAuthenticated
  );
  return restModelCreator(Model, response);
}

export async function patchToModel<T>(
  Model: new (data: any) => T,
  endpoint: string,
  data?: any,
  requestConfig?: Record<string, any>,
  isAuthenticated?: boolean
): Promise<{ payload: T | T[]; metadata: Record<string, any> } | ErrorModel> {
  const response = await HttpUtility.patch(
    endpoint,
    data,
    requestConfig,
    isAuthenticated
  );
  return restModelCreator(Model, response);
}
