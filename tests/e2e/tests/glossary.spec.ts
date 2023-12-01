import { expect, test } from './helpers/fixtures';
import { GlossaryPage } from './pages/glossaryPage';
import { hosts } from './helpers/hosts';

let glossary: GlossaryPage;

test.beforeEach(async ({ page }) => {
  glossary = new GlossaryPage(page);
  await glossary.goto(hosts['en'] + glossary.pageLinks.glossary);
});

test('[en] glossary page elements @smoke', async ({ isMobile }) => {
  await glossary.checkPageElements(isMobile);
});

test.describe('Alphabet', () => {
  test('[en] glossary page alphabet', async () => {
    await glossary.checkGlossaryAlphabet();
  });

  test('[en] glossary page alphabet input', async () => {
    await glossary.checkGlossaryAlphabetInput();
  });

  test('[en] glossary page input text', async () => {
    const text = 'Bitcoin';
    await glossary.glossaryInput.click();
    await glossary.page.keyboard.type(text);
    const links = glossary.glossaryLinks;
    await expect(links.first()).toContainText(text);
  });
});

test('[en] check glossary link', async ({ request, hosts }: any) => {
  const link = glossary.glossaryLinks.first();
  await glossary.checkLinks(request, hosts['en'], link);
});
