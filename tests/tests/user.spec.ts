import { expect, test } from '@playwright/test';
import { UserPage } from '../pageObject/userPage';

test.describe('Переход на страницу и авторизация', () => {
  let userPage: UserPage;

  test.beforeEach(async ({ page }) => {
    userPage = new UserPage(page);
    await userPage.open();
    await userPage.autAdmin();
  });
  //Этот тест всегда заверщается ошибкой из за "Ошибки сохранения" он призван показать как выглядит класический
  test('Добавляем пользователя с валидными данными', async ({ page }) => {
    const userPage = new UserPage(page);
    await userPage.addUser('Иван', 'Иванов');
  });
  //Это был жуткий геморой но всеже получилось
  test('Меняем столбцы местами', async ({ page }) => {
    await userPage.dragAndDrop();
  });

  test('Проверка наличия основных элементов на странице', async ({ page }) => {
    await userPage.verifyMainElements();
  });

  test('Проверка количества столбцов в таблице', async ({ page }) => {
    await userPage.verifyTableColumnsCount(5); // Логин, Имя, Фамилия, Email, Дата посещения
  });

  test('Проверка видимости таблицы пользователей', async ({ page }) => {
    await userPage.verifyTableIsVisible();
  });

  test('Проверка наличия обязательных заголовков столбцов', async ({ page }) => {
    await userPage.verifyHeadersPresence();
  });
  //Не знаю что еще протестировать надеюсь пока хватит
});
