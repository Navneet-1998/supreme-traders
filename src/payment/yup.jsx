import * as Yup from "yup"


export const utrSchema = Yup.object().shape({
  utr: Yup.number().min(12).max(12).required("Please provide UTR number after completing the payment")
})