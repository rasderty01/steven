// app/components/emails/templates/BirthdayEmail.tsx
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

export const BirthdayEmail = ({
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
    <Preview>Birthday Party Invitation - {eventName}</Preview>
    <Body style={styles.main}>
      <Container
        style={{
          ...styles.container,
          backgroundColor: "#f8f9ff",
        }}
      >
        <Heading
          style={{
            ...styles.heading,
            color: "#ff4081",
          }}
        >
          🎈 Let's Celebrate! 🎂
        </Heading>
        <Section style={styles.body}>
          <Text
            style={{
              ...styles.paragraph,
              fontSize: "18px",
              textAlign: "center" as const,
            }}
          >
            Hey {recipientName}!
          </Text>
          <Text
            style={{
              ...styles.paragraph,
              textAlign: "center" as const,
            }}
          >
            You're invited to an awesome birthday celebration!
          </Text>
          <Text
            style={{
              ...styles.paragraph,
              textAlign: "center" as const,
              backgroundColor: "#ff4081",
              color: "white",
              padding: "24px",
              borderRadius: "12px",
              margin: "32px 0",
            }}
          >
            🗓️ {eventDate}
            <br />⏰ {eventTime}
            <br />
            📍 {location}
          </Text>
          {description && (
            <Text
              style={{
                ...styles.paragraph,
                textAlign: "center" as const,
              }}
            >
              {description}
            </Text>
          )}
          <Link
            href={rsvpLink}
            style={{
              ...styles.button,
              backgroundColor: "#ff4081",
              display: "block",
              maxWidth: "200px",
              margin: "32px auto",
            }}
          >
            Join the Party! 🎉
          </Link>
        </Section>
        <Hr style={{ ...styles.hr, borderColor: "#ff4081" }} />
        <Text style={styles.footer}>
          Can't wait to celebrate with you!
          <br />
          {organizerName}
        </Text>
      </Container>
    </Body>
  </Html>
);
