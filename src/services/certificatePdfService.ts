import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PDFDocument } from "pdf-lib";
import {
  CERTIFICATE_PDF_FIELDS,
  CERTIFICATE_PDF_TEMPLATE_FILES,
  REQUIRED_PDF_FIELDS_BY_TYPE,
} from "@/constants/certificate-pdf-fields";
import type { Products } from "@/dtos/certificate";
import type { TokenType } from "@/repositories/userRepository";
import { CertificateTemplatesRepository } from "@/repositories/certificateTemplatesRepository";
import { CERTIFICATE_MANAGEMENT_ERRORS } from "@/constants/certificate-management";
import { isLegacyFallbackCutoffReached } from "@/utils/env";

type TGenerateCertificatePdfInput = {
  certificateNumber: string;
  type: TokenType;
  clientName: string;
  date: Date;
  companyName: string;
  technichalResponsible: string;
  product: Products;
};

// The standard font embedded in legacy templates uses the WinAnsi character
// set. Keep Portuguese/Windows-1252 characters intact and safely reduce any
// copied Unicode character that the font cannot encode (for example, "ů").
const WIN_ANSI_CHARACTER =
  /^[\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0160\u0161\u0178\u017d\u017e\u0192\u02c6\u02dc\u2013\u2014\u2018-\u201a\u201c-\u201e\u2020\u2021\u2022\u2026\u2030\u2039\u203a\u20ac]$/;

function normalizePdfText(value: string) {
  return Array.from(value)
    .map((character) => {
      if (WIN_ANSI_CHARACTER.test(character)) {
        return character;
      }

      const simplified = character.normalize("NFD").replace(/\p{Mark}/gu, "");
      const fallback = Array.from(simplified)
        .filter((item) => WIN_ANSI_CHARACTER.test(item))
        .join("");

      return fallback || "?";
    })
    .join("");
}

export class CertificatePdfService {
  private certificateTemplatesRepository: CertificateTemplatesRepository;

  constructor() {
    this.certificateTemplatesRepository = new CertificateTemplatesRepository();
  }

  private async loadTemplateFromMetadata(type: TokenType) {
    const activeTemplateByLegacyType =
      await this.certificateTemplatesRepository.findLatestActiveByLegacyTokenType(
        type,
      );

    if (!activeTemplateByLegacyType) {
      return null;
    }

    const normalizedStoragePath = activeTemplateByLegacyType.storagePath
      .replace(/^\/public\//, "")
      .replace(/^\//, "");
    const absolutePath = join(process.cwd(), "public", normalizedStoragePath);

    try {
      return await readFile(absolutePath);
    } catch {
      return null;
    }
  }

  private async loadTemplateByType(type: TokenType) {
    const metadataTemplate = await this.loadTemplateFromMetadata(type);

    if (metadataTemplate) {
      return metadataTemplate;
    }

    if (isLegacyFallbackCutoffReached()) {
      throw new Error(
        CERTIFICATE_MANAGEMENT_ERRORS.BACKFILL_INCOMPLETE_AT_CUTOFF,
      );
    }

    const templateFileName = CERTIFICATE_PDF_TEMPLATE_FILES[type];
    const templatePath = join(process.cwd(), "public", templateFileName);

    try {
      return await readFile(templatePath);
    } catch {
      throw new Error(
        `Template PDF nao encontrado na pasta public: ${templateFileName}`,
      );
    }
  }

  private resolveRequiredFieldValue(
    input: TGenerateCertificatePdfInput,
    fieldName: string,
  ) {
    const higienizacaoFields = CERTIFICATE_PDF_FIELDS.higienizacao;
    const impermeabilizacaoFields = CERTIFICATE_PDF_FIELDS.impermeabilizacao;
    const formattedDate = format(
      new Date(input.date),
      "dd 'de' MMMM 'de' yyyy",
      {
        locale: ptBR,
      },
    );

    const commonFieldValueMap: Record<string, string> = {
      [higienizacaoFields.certificateNumber]: input.certificateNumber,
      [higienizacaoFields.clientName]: input.clientName,
      [higienizacaoFields.date]: formattedDate,
      [higienizacaoFields.companyName]: input.companyName,
      [higienizacaoFields.technichalResponsible]: input.technichalResponsible,
    };

    if (fieldName === impermeabilizacaoFields.product) {
      return input.product || "";
    }

    return commonFieldValueMap[fieldName] || "";
  }

  private setFieldValueOrFail(
    form: ReturnType<PDFDocument["getForm"]>,
    fieldName: string,
    value: string,
  ) {
    try {
      const textField = form.getTextField(fieldName);
      textField.setText(normalizePdfText(value));
    } catch {
      throw new Error(`Campo obrigatorio do template ausente: ${fieldName}`);
    }
  }

  async generate(input: TGenerateCertificatePdfInput) {
    const templateBytes = await this.loadTemplateByType(input.type);
    const templatePdfBytes = new Uint8Array(templateBytes);
    const pdfDoc = await PDFDocument.load(templatePdfBytes);
    const form = pdfDoc.getForm();
    const requiredFields = REQUIRED_PDF_FIELDS_BY_TYPE[input.type];

    requiredFields.forEach((fieldName) => {
      const resolvedFieldValue = this.resolveRequiredFieldValue(
        input,
        fieldName,
      );

      if (!resolvedFieldValue.trim()) {
        throw new Error(`Campo obrigatorio sem valor: ${fieldName}`);
      }

      this.setFieldValueOrFail(form, fieldName, resolvedFieldValue);
    });

    form.flatten();

    return pdfDoc.save();
  }
}
