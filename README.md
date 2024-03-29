# Test admin-panel

React+MobX

## Installation

- Node 20+
- Install dependencies with `npm install`

## Running

- `npm build` to build project.
- `npm run dev` to run service in watch mode (nodemon to autoreload service + pretty logs). It does not run _full_ compilation, so some compiling errors may be ignored on startup.

## Development

- `npm run lint` && `npm run lint:fix` - to validate or repair formatting/linting/style.
- `npm test` to run tests, `npm run test:coverage` to run tests check code coverage

Also install comfortable IDE to get type hints, e.g. VSCode

## Configuration

You don't need .env file here, because you don't need server.

## Задание

1. Развернуть код в отдельной ветке и установить необходимые компоненты
2. подготовить текстовые тесткейсы на функционал управления раундом, в любом виде. оптимально использовать markdown и положить кейсы в эту же ветку
3. используя jest подготовить на выбор следующее:\
   3.1 покрыть юнит тестами src/controllers/RoundManagementController.ts\
   3.2 покрыть смок тестами функционал логина
4. логин\пароль: admin\admin
5. после выполнения сделать пулреквест - это будет является результатом тестового задания.
