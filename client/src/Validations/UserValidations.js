import * as yup from "yup";

/* =========================
   REGISTER VALIDATION
========================= */
export const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(4, "Minimum 4 characters")
    .max(20, "Maximum 20 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),

  // 💰 FIXED INCOME VALIDATION
  income: yup
    .number()
    .typeError("Income must be a number")
    .positive("Income must be greater than 0")
    .required("Income is required"),
});
