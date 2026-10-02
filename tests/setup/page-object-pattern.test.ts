import { test } from '@fixtures/test';
import { ExamplePage } from '@pages/example/example.page';

const HTML = `<label for="n">Name</label><input id="n" />
<button onclick="document.querySelector('[data-testid=greeting]').hidden=false;
document.querySelector('[data-testid=greeting]').textContent='Hello, '+document.getElementById('n').value">Greet</button>
<p data-testid="greeting" hidden></p>`;

test.describe('page object pattern', () => {
  test.beforeEach(async ({ page, examplePage }) => {
    await page.route(ExamplePage.route, (route) =>
      route.fulfill({ contentType: 'text/html', body: HTML }),
    );
    await examplePage.open();
  });

  test(
    'greets the user through the page object',
    { tag: ['@normal', '@fast', '@ui', '@framework'] },
    async ({ examplePage }) => {
      await examplePage.assert.greetingIsHidden();
      await examplePage.greet('Pratham');
      await examplePage.assert.greetingHasText('Hello, Pratham');
    },
  );
});
