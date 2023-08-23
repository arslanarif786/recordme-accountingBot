export const EMAIL_RULE = (value) => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(value) || "Invalid e-mail.";
};
export const REQUIRED_RULE = [(val) => (val || "").length > 0 || "required"];

export const LOAN_RULE = [(v) => v <= 6 || "Max 6 months"];
