import { expect, Locator, Page } from 'playwright/test';

export class UserPage {
  private readonly page: Page;
  private readonly authLoginLocator: Locator;
  private readonly authPasswordLocator: Locator;
  private readonly signInButtonLocator: Locator;
  private readonly addUserButtonLocator: Locator;
  private readonly newUserNameLocator: Locator;
  private readonly newUserSecondNameLocator: Locator;
  private readonly addButtonUserModalLocator: Locator;
  private readonly headerLoginLocator: Locator;
  private readonly headerNameLocator: Locator;
  private nameTablLocator: Locator | null = null;
  private secondNameTablLocator: Locator | null = null;

  constructor(page: Page) {
    this.page = page;
    this.authLoginLocator = this.page.getByRole('textbox', { name: 'Username' });
    this.authPasswordLocator = this.page.getByRole('textbox', { name: 'Password' });
    this.signInButtonLocator = this.page.getByRole('button', { name: 'Sign In' });
    this.addUserButtonLocator = this.page.getByRole('button', { name: 'Добавить пользователя' });
    this.newUserNameLocator = this.page.getByRole('textbox', { name: 'Имя' });
    this.newUserSecondNameLocator = this.page.getByRole('textbox', { name: 'Фамилия' });
    this.addButtonUserModalLocator = this.page.getByRole('button', { name: 'Добавить' });
    this.headerLoginLocator = this.page.getByRole('columnheader', { name: 'Логин' });
    this.headerNameLocator = this.page.getByRole('columnheader', { name: 'Имя' });

    //action
  }
  async open() {
    await this.page.goto('https://mes.inka.team/ru/form/user-table');
  }
  async autAdmin() {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;

    if (!username || !password) {
      throw new Error(
        'Учетные данные не заданы. Пожалуйста, установите переменные окружения USERNAME и PASSWORD в файле .env',
      );
    }

    await this.authLoginLocator.fill(username);
    await this.authPasswordLocator.fill(password);
    await this.signInButtonLocator.click();
  }
  async addUser(name: string, surname: string) {
    await this.addUserButtonLocator.click();
    await this.newUserNameLocator.fill(name);
    await this.newUserSecondNameLocator.fill(surname);
    await expect(this.addButtonUserModalLocator).toBeEnabled();
    await this.addButtonUserModalLocator.click();

    // Инициализация локаторов после получения значений name и surname
    this.nameTablLocator = this.page.getByText(name, { exact: true });
    this.secondNameTablLocator = this.page.getByText(surname, { exact: true });

    await this.nameTablLocator.waitFor();
    await this.secondNameTablLocator.waitFor();
  }
  //assertions
  async newUserInfo() {
    if (!this.nameTablLocator || !this.secondNameTablLocator) {
      throw new Error('Локаторы пользователя не инициализированы');
    }
    await expect(this.nameTablLocator).toBeVisible();
    await expect(this.secondNameTablLocator).toBeVisible();
  }

  async verifyMainElements() {
    await expect(this.addUserButtonLocator).toBeVisible();
    const tableHeaders = this.page.locator('[role="columnheader"]');
    const count = await tableHeaders.count();
    expect(count).toBeGreaterThan(0);
  }

  async verifyTableColumnsCount(expectedCount: number = 5) {
    const headers = this.page.locator('[role="columnheader"]');
    const count = await headers.count();
    expect(count).toBe(expectedCount);
  }

  async verifyTableIsVisible() {
    const table = this.page.locator('table, [role="grid"]');
    await expect(table.first()).toBeVisible();
  }

  async verifyHeadersPresence() {
    const headers = this.page.locator('[role="columnheader"]');
    const headerTexts = await headers.allTextContents();
    const requiredHeaders = ['Логин', 'Имя', 'Фамилия', 'Email'];

    for (const requiredHeader of requiredHeaders) {
      const found = headerTexts.some((text) => text.trim().includes(requiredHeader));
      expect(found).toBeTruthy();
    }
  }
  async dragAndDrop() {
    //Это адский геморой
    // Получаем начальные позиции через поиск индекса
    const headers = this.page.locator('[role="columnheader"]');
    const count = await headers.count();

    let initialLoginIndex = -1;
    let initialNameIndex = -1;
    for (let i = 0; i < count; i++) {
      const text = (await headers.nth(i).textContent())?.trim() || '';
      if (text === 'Логин' || text.startsWith('Логин')) initialLoginIndex = i;
      if (text === 'Имя' || text.startsWith('Имя')) initialNameIndex = i;
    }

    // Меняем столбцы местами
    await this.headerLoginLocator.dragTo(this.headerNameLocator);
    await this.page.waitForTimeout(500);

    // Проверяем, что столбцы поменялись местами
    const headersAfter = this.page.locator('[role="columnheader"]');
    const countAfter = await headersAfter.count();

    let afterLoginIndex = -1;
    let afterNameIndex = -1;
    for (let i = 0; i < countAfter; i++) {
      const text = (await headersAfter.nth(i).textContent())?.trim() || '';
      if (text === 'Логин' || text.startsWith('Логин')) afterLoginIndex = i;
      if (text === 'Имя' || text.startsWith('Имя')) afterNameIndex = i;
    }

    // Проверяем, что порядок изменился
    if (initialLoginIndex !== -1 && initialNameIndex !== -1) {
      expect(afterLoginIndex).not.toBe(initialLoginIndex);
      expect(afterNameIndex).not.toBe(initialNameIndex);
    }
  }
}
