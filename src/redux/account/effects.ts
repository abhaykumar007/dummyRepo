import { registerType } from "@/types/auth";
import api from "@/utilities/api";
import { post } from "@/utilities/httpClient";

export default class AccountEffects {
  static requestRegister(payload: registerType) {
    return post(api.REGISTER, payload);
  }
}
