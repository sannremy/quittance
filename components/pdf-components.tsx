import { Font, Line, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";

// Register font (shared between Quittance and Echeance)
Font.register({
  family: "AfacadFlux",
  fonts: [
    { src: "/fonts/AfacadFlux-Regular.ttf" },
    { src: "/fonts/AfacadFlux-SemiBold.ttf", fontWeight: 600 },
  ],
});

export const colors = {
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

export const styles = StyleSheet.create({
  page: {
    fontFamily: "AfacadFlux",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    color: colors["slate-800"],
  },
});

export const ContentLine = ({ label, value }: { label: string; value: string }) => (
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

export const ContentSeparator = () => (
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
