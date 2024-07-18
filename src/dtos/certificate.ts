export class CertificateDTO {
  private _certificate_token: string;
  private _id: string | undefined;

  constructor(certificate_token: string, id?: string) {
    this._id = id;
    this._certificate_token = certificate_token;
  }

  get certificate_token() {
    return this._certificate_token;
  }

  get id() {
    return this._id;
  }

  static fromDb(data: { certificate_token: string; id: string }) {
    return new CertificateDTO(data.certificate_token, data.id);
  }
}
