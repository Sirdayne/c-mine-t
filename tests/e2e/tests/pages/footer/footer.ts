import { expect } from '@playwright/test';
import { BasePage } from '../basePage';

export class Footer extends BasePage {
  footerContainer = this.page.getByTestId('footer-container');
  footerContainerAsiaMobile = this.page.getByTestId('footer-container-asia-mobile');
  footerLinks = this.page.getByTestId('footer-link');
  subscribeFormInput = this.page.getByTestId('footer-subscription-form-input');
  subscribeSumbitButton = this.page.getByTestId('footer-subscribe-submit-button');
  notificationMessage = this.page.getByTestId('footer-subscribe-notification');
  termsOfService = this.page.getByTestId('footer-terms').locator('a');
  footerSocialLinks = this.page.getByTestId('footer-social-link').locator('visible=true');

  emptyMessages = {
    en: 'Invalid email address',
    it: 'Indirizzo email non valido',
    de: 'Ungültige E-Mail-Adresse',
    es: 'Correo electrónico inválido',
    ar: 'عنوان البريد الإلكتروني غير صالح',
    tr: 'Geçersiz e-posta adresi',
    br: 'Endereço de email inválido',
    jp: 'メールアドレスが無効です',
    cn: '邮箱地址无效',
  };

  successMessages = {
    en: 'A\xA0confirmation\xA0email\xA0was\xA0sent\xA0to\xA0your\xA0inbox.', // A non-breaking space (0xA0) is not a normal space (0x20)
    it: "Ti ringraziamo per l'iscrizione",
    de: 'Danke für die Abonnierung',
    es: 'Gracias por suscribirte',
    ar: 'شكرًا لك على الاشتراك',
    tr: 'Abone olduğunuz için teşekkür ederiz',
    br: 'Obrigado por se inscrever',
    jp: 'ご購読ありがとうございます',
    cn: '谢谢您的订阅',
  };

  async checkFooterIsVisible() {
    await expect(this.footerContainer).toBeVisible();
  }
}
