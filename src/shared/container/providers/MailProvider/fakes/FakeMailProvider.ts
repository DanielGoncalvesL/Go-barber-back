import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IMassage{
  to: string;
  body: string;
}

export default class FakeMailProvider implements IMailProvider {
  private messages: IMassage[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.messages.push({
      to,
      body,
    });
  }
}
