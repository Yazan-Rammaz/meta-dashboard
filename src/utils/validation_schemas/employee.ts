import * as yup from "yup"

export const employeeSchema = yup.object({
    roles: yup.array().min(1, "at least one role").required("roles is required"),
    full_name: yup.string().required("full name is required")
})