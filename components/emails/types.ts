// app/components/emails/types.ts
import { Database } from "@/utils/supabase/database.types";

export interface BaseEmailProps {
  eventName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  description?: string;
  recipientName: string;
  organizerName: string;
  rsvpLink: string;
}

export type EmailTemplateType =
  Database["public"]["Enums"]["EmailTemplateType"];

export interface EmailTemplateConfig {
  id: number;
  name: string;
  type: EmailTemplateType;
  description: string;
}

// Default templates that will be seeded in the database
export const DEFAULT_TEMPLATES: EmailTemplateConfig[] = [
  {
    id: 1,
    name: "General Event Invitation",
    type: "general",
    description:
      "A professional template for business events and general gatherings",
  },
  {
    id: 2,
    name: "Wedding Invitation",
    type: "wedding",
    description:
      "An elegant template for wedding invitations and save-the-dates",
  },
  {
    id: 3,
    name: "Birthday Party Invitation",
    type: "birthday",
    description: "A fun and festive template for birthday celebrations",
  },
];

// Common styles shared across email templates
export const EMAIL_STYLES = {
  main: {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  },
  container: {
    margin: "0 auto",
    padding: "20px 25px 48px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "32px",
    textAlign: "center" as const,
    color: "#1a1a1a",
  },
  subheading: {
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "24px",
    color: "#333333",
  },
  body: {
    margin: "24px 0",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#4a4a4a",
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: "6px",
    color: "#fff",
    display: "inline-block",
    padding: "14px 28px",
    textDecoration: "none",
    textAlign: "center" as const,
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "16px",
  },
  hr: {
    borderColor: "#dddddd",
    marginTop: "48px",
  },
  footer: {
    color: "#8898aa",
    fontSize: "12px",
    marginTop: "24px",
    textAlign: "center" as const,
  },
};
