"use client";

import {
  Document,
  PDFViewer,
  Page,
  Text,
  View,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import type { PDFVersion } from "@react-pdf/types";
import { useIsClient } from "usehooks-ts";
import { Suspense } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LucideDownload } from "lucide-react";
import { colors, styles, ContentLine, ContentSeparator } from "@/components/pdf-components";

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

const Echeance = ({
  rent,
  landlord,
  tenant,
  title,
  period,
  text,
  legalText,
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
  const capitalize = (s: string) => (s && String(s[0]).toUpperCase() + String(s).slice(1)) || "";

  const document = <Echeance {...echeanceProps} />;
  const fileName = `${echeanceProps.metadata.title} - ${capitalize(format(echeanceProps.startDate, "MMMM yyyy", { locale: fr }))}.pdf`;

  return isClientSide && (
    <Suspense>
      <div className="px-5 h-8 flex items-center">
        <PDFDownloadLink document={document} fileName={fileName} className="flex items-center gap-2">
          <LucideDownload className="w-5 h-5" />
          {fileName}
        </PDFDownloadLink>
      </div>
      <PDFViewer className="relative w-full h-screen">
        {document}
      </PDFViewer>
    </Suspense>
  );
};

export type { EcheanceProps };
export default PDFEcheance;
