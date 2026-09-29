"use client";

import {
  Document,
  Image,
  PDFDownloadLink,
  PDFViewer,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import type { PDFVersion } from "@react-pdf/types";
import { useIsClient } from "usehooks-ts";
import { Suspense } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LucideDownload } from "lucide-react";
import { colors, styles, ContentLine, ContentSeparator } from "@/components/pdf-components";

type RevisionProps = {
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

  currentRent: string;
  newRent: string;
  currentCharges: string;
  newCharges: string;
  newTotal: string;
  previousIrlLabel: string;
  newIrlLabel: string;
  previousIrlValue: string;
  newIrlValue: string;
  totalAmount: string; // Automatically computed and formatted
};

const Revision = ({
  rent,
  landlord,
  tenant,
  title,
  period,
  text,
  legalText,
  signature,
  metadata,
  currentRent,
  newRent,
  currentCharges,
  newCharges,
  newTotal,
  previousIrlLabel,
  newIrlLabel,
  previousIrlValue,
  newIrlValue,
}: RevisionProps) => {
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

          <View style={{ marginBottom: "0.4cm" }}>
            <ContentLine label="Loyer mensuel actuel" value={currentRent} />
            <ContentLine
              label={`IRL de référence (${previousIrlLabel})`}
              value={previousIrlValue}
            />
            <ContentLine
              label={`Nouvel IRL (${newIrlLabel})`}
              value={newIrlValue}
            />
            <ContentLine label="Nouveau loyer mensuel" value={newRent} />
          </View>

          <View style={{ marginBottom: "0.4cm" }}>
            <ContentLine
              label="Provision pour charges actuelle"
              value={currentCharges}
            />
            <ContentLine
              label="Nouvelle provision pour charges"
              value={newCharges}
            />
          </View>

          <ContentLine label="Nouveau total mensuel" value={newTotal} />

          <View
            style={{
              marginTop: "1cm",
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src={signature.imageUrl}
              style={{
                width: signature.width,
                height: "auto",
              }}
            />
          </View>
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

const PDFRevision = (revisionProps: RevisionProps) => {
  const isClientSide = useIsClient();
  const capitalize = (s: string) => (s && String(s[0]).toUpperCase() + String(s).slice(1)) || "";

  const document = <Revision {...revisionProps} />;
  const fileName = `${revisionProps.metadata.title} - ${capitalize(format(revisionProps.startDate, "MMMM yyyy", { locale: fr }))}.pdf`;

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

export type { RevisionProps };
export default PDFRevision;
