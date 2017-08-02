# Tembusu telegram bot

[![Build Status](https://travis-ci.org/SoraSkyy/tembu-telegram-bot.svg?branch=master)](https://travis-ci.org/SoraSkyy/tembu-telegram-bot) [![Coverage Status](https://coveralls.io/repos/github/SoraSkyy/tembu-telegram-bot/badge.svg?branch=master)](https://coveralls.io/github/SoraSkyy/tembu-telegram-bot?branch=master)

Notes: For some reason istanbul needs to be 1.0.0 alpha for coverage to work.

How the bot works
=

## Initialization

Every user that communicates with the bot will be assigned a `StateManager`. The creation of a new `StateManager` is done in _main.js_:

```javascript
stateManagers[msg.chat.id] = new StateManager(msg.chat.id);
```
_main.js_ sends in the required information that the `StateManager` needs upon creation.

From here on out, all messages sent by the user will be handed over into their own respective `StateManager` for processing. Let's take a look at the `StateManager` in detail.

## The StateManager
The `StateManager` is found in _stateManager.js_. On creation, it initializes as such:

```javascript
export default class StateManager {
  constructor(id) {
    this.id = id;
    this.state = [];
  }
```

Apart from storing the chat's id, it keeps track of the state in the form of a list. The list works as a **stack**, with the zeroth element being the current state. You will see the `StateManager` making calls to the current state as such:

```javascript
this.state[0].render()
```

Of course, the implementation of the data structure is subject to change.

By default, the `StateManager` starts out with the `RootState`. The actual implementation of `State`s will be explained later. The `RootState` is responsible for the first menu that the user will see.


