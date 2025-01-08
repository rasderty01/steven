// app/components/emails/templates/GeneralEventEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { BaseEmailProps, EMAIL_STYLES as styles } from "../types";

export const GeneralEventEmail = ({
  eventName,
  eventDate,
  eventTime,
  location,
  description,
  recipientName,
  organizerName,
  rsvpLink,
}: BaseEmailProps) => (
  <Html>
    <Head />
    <Preview>You're invited to {eventName}!</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Heading style={styles.heading}>You're Invited! 🎉</Heading>
        <Section style={styles.body}>
          <Text style={styles.paragraph}>Dear {recipientName},</Text>
          <Text style={styles.paragraph}>
            You are cordially invited to {eventName}. We would be delighted to
            have you join us for this special occasion.
          </Text>
          <Text style={{ ...styles.paragraph, marginTop: "24px" }}>
            <strong>Event Details:</strong>
            <br />
            📅 Date: {eventDate}
            <br />
            🕒 Time: {eventTime}
            <br />
            📍 Location: {location}
          </Text>
          {description && <Text style={styles.paragraph}>{description}</Text>}
          <Link href={rsvpLink} style={styles.button}>
            RSVP Now
          </Link>
        </Section>
        <Hr style={styles.hr} />
        <Text style={styles.footer}>
          Best regards,
          <br />
          {organizerName}
        </Text>
      </Container>
    </Body>
  </Html>
);
