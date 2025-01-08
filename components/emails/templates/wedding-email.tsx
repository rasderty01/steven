// app/components/emails/templates/WeddingEmail.tsx
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

export const WeddingEmail = ({
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
    <Preview>Wedding Invitation - {eventName}</Preview>
    <Body style={styles.main}>
      <Container
        style={{
          ...styles.container,
          backgroundColor: "#faf7f5",
        }}
      >
        <Heading
          style={{
            ...styles.heading,
            fontFamily: "serif",
            color: "#826d5e",
          }}
        >
          Save the Date
        </Heading>
        <Section style={styles.body}>
          <Text
            style={{
              ...styles.paragraph,
              textAlign: "center" as const,
              fontSize: "20px",
              color: "#826d5e",
            }}
          >
            Dear {recipientName},
          </Text>
          <Text
            style={{
              ...styles.paragraph,
              textAlign: "center" as const,
              lineHeight: "32px",
            }}
          >
            We joyfully invite you to share in the celebration of our wedding
          </Text>
          <Text
            style={{
              ...styles.paragraph,
              textAlign: "center" as const,
              fontSize: "24px",
              margin: "32px 0",
              color: "#826d5e",
            }}
          >
            {eventDate}
            <br />
            at {eventTime}
            <br />
            {location}
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
              backgroundColor: "#826d5e",
              display: "block",
              maxWidth: "200px",
              margin: "32px auto",
            }}
          >
            RSVP
          </Link>
        </Section>
        <Hr style={{ ...styles.hr, borderColor: "#826d5e" }} />
        <Text
          style={{
            ...styles.footer,
            color: "#826d5e",
          }}
        >
          With love,
          <br />
          {organizerName}
        </Text>
      </Container>
    </Body>
  </Html>
);
