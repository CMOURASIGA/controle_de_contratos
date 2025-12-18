// RelatorioAtividadeSGR.tsx

import { Atividade } from "@/types/atividade.type";
import {
  formatDateToDDMMYYYY,
  getHoraAtual,
} from "@/utils/generate-format-date";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// ====== ESTILOS ======
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },

  box: {
    border: "1px solid #000",
    padding: 10,
    marginBottom: 20,
  },

  headerLogoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    width: 160,
    marginBottom: 4,
  },

  headerRight: {
    fontSize: 9,
    textAlign: "right",
    lineHeight: 1.4,
  },

  titleContainer: {
    textAlign: "center",
    marginTop: 6,
    marginBottom: 2,
  },

  title: {
    fontSize: 12,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 10,
    marginTop: 2,
  },

  row: {
    flexDirection: "row",
    marginBottom: 4,
  },

  label: {
    fontWeight: "bold",
  },

  divider: {
    marginTop: 40,
    borderTop: "0.7px solid #000",
    width: "100%",
  },

  footer: {
    marginTop: 8,
    textAlign: "left",
    fontSize: 10,
  },
});

// ====== COMPONENTE ======
export const RelatorioAtividade = ({ atividade }: { atividade: Atividade }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* ======== CAIXA PRINCIPAL ======== */}
      <View style={styles.box}>
        {/* LINHA DO LOGO + DATA/HORA */}
        <View style={styles.headerLogoRow}>
          <Image src="/logo-cnc.png" style={styles.logo} />

          <View style={styles.headerRight}>
            <Text>Página: 1</Text>
            <Text>Data: {formatDateToDDMMYYYY(new Date())}</Text>
            <Text>Hora: {getHoraAtual()}</Text>
          </View>
        </View>

        {/* TÍTULO */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Representantes</Text>
          <Text style={styles.subtitle}>Relatório de Atividade - SGR</Text>
        </View>
      </View>

      {/* ======== INFORMAÇÕES ======== */}
      <View>
        <View style={styles.headerLogoRow}>
          <View style={styles.row}>
            <Text style={styles.label}>Representante: </Text>
            <Text>{atividade.Representante?.nome}</Text>
          </View>

          <View style={styles.row}>
            <Text style={{ ...styles.label }}>Período: </Text>
            <Text>
              {formatDateToDDMMYYYY(atividade.dataInicioAtividade)} a{" "}
              {formatDateToDDMMYYYY(atividade.dataFimAtividade)}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Órgão: </Text>
          <Text>{atividade.Orgao?.nome}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Área Temática: </Text>
          <Text>{atividade.descricaoAtividade}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Representação: </Text>
          <Text>{atividade.Representacao?.nome}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nº Atividade: </Text>
          <Text>{atividade.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Local/Cidade: </Text>
          <Text>{atividade.enderecoEvento}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Pauta: </Text>
          <Text>{atividade.descricaoPauta}</Text>
        </View>
      </View>

      {/* ======== LINHA + RODAPÉ ======== */}
      <View style={styles.divider} />
      <Text style={styles.footer}>
        Cadastrado em: {formatDateToDDMMYYYY(atividade.dataCadastro)}
      </Text>
    </Page>
  </Document>
);
