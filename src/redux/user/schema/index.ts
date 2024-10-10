import { User } from "@/pages/userManagement/types";
import { normalizeData } from "@/types/normalize";
import { denormalize, normalize, schema } from "normalizr";

const user = new schema.Entity("users", {}, { idAttribute: "userId" });

const userListSchema = [user];

const userNormalizeSchema = (data: normalizeData) => normalize(data, userListSchema);

export const userDenormalizeSchema = (data: normalizeData) => {
  const { result, entities } = data;
  if (result && entities) return denormalize(result, userListSchema, entities);
  return [];
};

export const addNormalizeUser =(data :normalizeData, newUser:User)=>{
    const { result, entities } = data
    
    if (result && entities) {
      const resultArray = Array.isArray(result) ? result : [result];
      return {
        result: [newUser.userId , ...resultArray],
        entities: {users: {...entities.users,[newUser.userId]: newUser}}
    }}

    return data
}

export default userNormalizeSchema;