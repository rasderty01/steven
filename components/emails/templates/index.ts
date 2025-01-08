// app/components/emails/templates/index.ts
export * from "./general-event-email";
export * from "./wedding-email";
export * from "./birthday-email";

import { GeneralEventEmail } from "./general-event-email";
import { WeddingEmail } from "./wedding-email";
import { BirthdayEmail } from "./birthday-email";
import { EmailTemplateType } from "../types";

export const getEmailTemplate = (type: EmailTemplateType) => {
  console.log("getEmailTemplate called with type:", type);

  // Make case-insensitive
  const normalizedType = type.toLowerCase();
  console.log("Normalized type:", normalizedType);

  let template;
  switch (normalizedType) {
    case "wedding":
      template = WeddingEmail;
      break;
    case "birthday":
      template = BirthdayEmail;
      break;
    case "general":
      template = GeneralEventEmail;
      break;
    default:
      console.warn(
        "Unknown template type:",
        type,
        "falling back to general template"
      );
      template = GeneralEventEmail;
  }

  console.log("Returning template component:", template?.name);
  return template;
};
