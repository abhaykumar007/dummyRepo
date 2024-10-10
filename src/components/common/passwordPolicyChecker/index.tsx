import {
  hasLowerCase,
  hasNumber,
  hasSpecialChar,
  hasUpperCase,
} from "@/utilities/regex";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import "./style.scss";

interface Policy {
  minimumLength?: number;
  lowerCase?: boolean;
  upperCase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  [key: string]: any;
}

interface PoliciesStatus {
  [key: string]: boolean;
}

type PolicyKey =
  | "minimumLength"
  | "lowerCase"
  | "upperCase"
  | "numbers"
  | "symbols";

export const getInitialPolicyStatus = (policy: Policy): PoliciesStatus => {
  return Object.entries(policy).reduce(
    (result, [key, value]) => (value ? { ...result, [key]: false } : result),
    {}
  ) as PoliciesStatus;
};

const getPolicyMessagesMap = (minimumLength: number) => ({
  minimumLength: `At least ${minimumLength} characters.`,
  lowerCase: "Lower case character(s)",
  upperCase: "Upper case character(s)",
  numbers: "Number(s)",
  symbols:
    "Special characters (s) from list =+-^$*.[]{}()?\"!@#%&/\\,><':;|_~`",
});

export function checkPolicyStatus(
  policiesStatus: PoliciesStatus,
  password: string,
  policy: Policy
): PoliciesStatus {
  return Object.keys(policiesStatus).reduce<PoliciesStatus>(
    (result, policyName) => {
      switch (policyName) {
        case "minimumLength": {
          const minLength = policy[policyName] as number;
          return {
            ...result,
            [policyName]: password.length >= minLength,
          };
        }
        case "lowerCase": {
          return { ...result, [policyName]: hasLowerCase(password) };
        }
        case "upperCase": {
          return { ...result, [policyName]: hasUpperCase(password) };
        }
        case "numbers": {
          return { ...result, [policyName]: hasNumber(password) };
        }
        case "symbols": {
          return { ...result, [policyName]: hasSpecialChar(password) };
        }
        default:
          return result;
      }
    },
    {} as PoliciesStatus
  );
}

interface PasswordPolicyCheckerProps {
  password: string;
  policy: Policy;
}

const PasswordPolicyChecker: React.FC<PasswordPolicyCheckerProps> = ({
  password,
  policy,
}) => {
  const [policiesStatus, setPolicyStatus] = useState(
    getInitialPolicyStatus(policy)
  );
  useEffect(() => {
    if (password !== undefined) {
      const result = checkPolicyStatus(policiesStatus, password, policy);
      setPolicyStatus(result);
    }
  }, [password]);

  const policyMessagesMap = getPolicyMessagesMap(policy.minimumLength!);

  return (
    <div className="check_policy_container">
      <p className="bodyText">Your password needs to have:</p>
      <div>
        {Object.entries(policiesStatus).map(([key, value]) => (
          <div
            className={`policy_type description ${
              value ? "text-success" : "text-danger"
            }`}
          >
            <p>
              {value ? (
                <FaCheckCircle fontSize={15} />
              ) : (
                <IoMdCloseCircle fontSize={17} />
              )}
            </p>
            <p>{policyMessagesMap[key as PolicyKey]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordPolicyChecker;
