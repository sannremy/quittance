"use client";

import {
  Document,
  Font,
  Image,
  Line,
  PDFViewer,
  Page,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import type { PDFVersion } from "@react-pdf/types";
import { useIsClient } from "usehooks-ts";
import { Suspense } from "react";

type EcheanceProps = {
  startDate: Date;
  endDate: Date;
  paymentDate: string;

  rent: {
    amounts: {
      label: string;
      amount: string;
    }[];
    currency: string;
    address: string;
    city: string;
    zipCode: string;
  };

  landlord: {
    title: string;
    name: string;
    address: string;
    zipCode: string;
    city: string;
  };

  tenant: {
    title: string;
    name: string;
    address: string;
    city: string;
    zipCode: string;
  };

  title: string;
  period: string;

  text: string;
  legalText: string;
  signature: {
    width: string;
    imageUrl: string;
  };

  metadata: {
    title: string;
    author: string;
    subject: string;
    keywords: string;
    creator: string;
    producer: string;
    pdfVersion: PDFVersion;
    language: string;
  };

  totalAmount: string; // Automatically computed and formatted
};

// Register font
Font.register({
  family: "AfacadFlux",
  fonts: [
    { src: "/fonts/AfacadFlux-Regular.ttf" },
    { src: "/fonts/AfacadFlux-SemiBold.ttf", fontWeight: 600 },
  ],
});

const colors = {
  "slate-50": "#f8fafc",
  "slate-100": "#f1f5f9",
  "slate-200": "#e2e8f0",
  "slate-300": "#cbd5e1",
  "slate-400": "#94a3b8",
  "slate-500": "#64748b",
  "slate-600": "#475569",
  "slate-700": "#334155",
  "slate-800": "#1e293b",
  "slate-900": "#0f172a",
  "slate-950": "#020617",
};

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "AfacadFlux",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    color: colors["slate-800"],
  },
});

const ContentLine = ({ label, value }: { label: string; value: string }) => (
  <View
    style={{
      flexDirection: "row",
      fontSize: 12,
      gap: "2cm",
      paddingBottom: "0.1cm",
    }}
  >
    <View
      style={{
        width: "50%",
        fontWeight: 600,
      }}
    >
      <Text>{label}</Text>
    </View>
    <View
      style={{
        width: "50%",
        color: colors["slate-500"],
      }}
    >
      <Text>{value}</Text>
    </View>
  </View>
);

const ContentSeparator = () => (
  <Svg
    height="1"
    width="100%"
    style={{
      marginTop: "1cm",
      marginBottom: "1cm",
    }}
  >
    <Line
      x1="0"
      y1="0"
      x2="1000"
      y2="0"
      strokeWidth={1}
      stroke={colors["slate-500"]}
    />
  </Svg>
);

const Echeance = ({
  paymentDate,
  rent,
  landlord,
  tenant,
  title,
  period,
  text,
  legalText,
  signature,
  metadata,
  totalAmount, // Automatically computed
}: EcheanceProps) => {
  return (
    <Document {...metadata}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View
          style={{
            backgroundColor: colors["slate-100"],
            paddingTop: "2cm",
            paddingBottom: "1cm",
            paddingLeft: "1.5cm",
            paddingRight: "1.5cm",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: "2cm",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "50%",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors["slate-500"],
                }}
              >
                {period}
              </Text>
            </View>
            <View
              style={{
                width: "50%",
                fontSize: 12,
                color: colors["slate-500"],
              }}
            >
              <Text>{rent.address}</Text>
              <Text>
                {rent.zipCode} {rent.city}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View
          style={{
            paddingTop: "1cm",
            paddingBottom: "1.5cm",
            paddingLeft: "1.5cm",
            paddingRight: "1.5cm",
            fontSize: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: "2cm",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "50%",
              }}
            >
              <Text
                style={{
                  fontWeight: 600,
                }}
              >
                Bailleur
              </Text>
              <Text
                style={{
                  color: colors["slate-500"],
                }}
              >
                {landlord.name}
              </Text>
              <Text
                style={{
                  color: colors["slate-500"],
                }}
              >
                {landlord.address}
              </Text>
              <Text
                style={{
                  color: colors["slate-500"],
                }}
              >
                {landlord.zipCode} {landlord.city}
              </Text>
            </View>
            <View
              style={{
                width: "50%",
              }}
            >
              <Text
                style={{
                  fontWeight: 600,
                }}
              >
                Locataire
              </Text>
              <Text
                style={{
                  color: colors["slate-500"],
                }}
              >
                {tenant.name}
              </Text>
              <Text
                style={{
                  color: colors["slate-500"],
                }}
              >
                {tenant.address}
              </Text>
              <Text
                style={{
                  color: colors["slate-500"],
                }}
              >
                {tenant.zipCode} {tenant.city}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: "1cm",
            }}
          >
            <Text>{text}</Text>
          </View>

          <ContentSeparator />

          {rent.amounts.map(({ label, amount }) => (
            <ContentLine key={label} label={label} value={amount} />
          ))}

          <ContentLine label="Total à payer" value={totalAmount} />

          {/* <View
            style={{
              marginTop: "1cm",
            }}
          >
            <Image
              src={signature.imageUrl}
              style={{
                width: signature.width,
                height: "auto",
              }}
            />
          </View> */}
        </View>

        {/* Footer */}
        <View
          style={{
            position: "absolute",
            bottom: "2cm",
            left: "1.5cm",
            right: "1.5cm",
            color: colors["slate-500"],
            fontSize: 10,
          }}
        >
          <Text>{legalText}</Text>
        </View>
      </Page>
    </Document>
  );
};

const PDFEcheance = (echeanceProps: EcheanceProps) => {
  const isClientSide = useIsClient();

  return isClientSide && (
    <Suspense>
      <PDFViewer className="relative w-full h-screen">
        <Echeance {...echeanceProps} />
      </PDFViewer>
    </Suspense>
  );
};

export type { EcheanceProps };
export default PDFEcheance;
