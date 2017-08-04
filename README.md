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

The `render()` method is defined as the displaying of the menu buttons that result in the transition to another state. We can see render method is defined in the parent `State` object, found in _state.js_.


```javascript
export default class State {
  render() {
    const buttons = this.makeButtons();
    return {
      respond: true,
      messages: [
        State.makeButtonMessage('Choose an option.', buttons)
      ]
    };
  }
```

Notice that all states inherit this class, and will call the `render()` method when it wants to display the navigation menu.

In order for `render()` to work properly, the `makeButtons()` method must be implemented. The actual implementation will differ depending on the nature of the state, but in general it has to return a list of lists of strings. See the telegram API for more information. An example implementation of `makeButtons()` is found in _rootState.js_.

```javascript
makeButtons() {
  const mappedButtons = Object.keys(this.nextStates).map((commandString) => {
    return [commandString];
  });
  return mappedButtons;
}
```

Note that if you wish to allow the user to go back to a previous state, it should contain a 'Back' button. In _interestGroupState.js_, this can be found:

```javascript
makeButtons() {
  const nextCommands = Object.keys(this.nextActions);
  nextCommands.push('Back');
  const mappedButtons = nextCommands.map((commandString) => {
    return [commandString];
  });
  return mappedButtons;
}
```

The logic of these buttons is that the corresponding text will be sent back to the bot once these buttons are clicked. So if the user clicks the 'Back' button, the message 'Back' will be sent to the bot. The handling of 'Back' is done by `StateManager`, and can be seen here:

```javascript
if (msg.text === 'Back' && this.state.length > 1) {
  this.state = this.state.splice(1);
  return this.addIDParam(this.state[0].render());
}
```

The `StateManager` will pop out its current state and render the previous state.

The handling of the text in `StateManager` also tells us about how text messages are handled in general--by calling `msg.text`.

All messages that are not captured by the `StateManager` will be sent to the respective state, through the `process()` method. Process takes in the message object directly. This is found in _interestGroupState.js_:

```javascript
process(msg) {
  const selectedOption = Object.keys(this.nextActions).indexOf(msg.text);
  if (selectedOption === -1) return this.render();
  return (this.nextActions[msg.text])();
}
```

How you wish to implement the processing is up to you, as long as you return an object with the required parameters back to the `StateManager`. If the state wants to return messages to the user, then it needs a `respond: true` parameter, followed by a list of messages like `messages: []`. Each `message` object inside the list of `messages: []` should follow the telegram API. An example of the generation of a `TextMessage` object with the `reply_markup` parameter can be found in the `makeButtonMessage(text, buttons)` method in _state.js_:

```javascript
return {
  type: 'text',
  text,
  options: {
    reply_markup: {
      keyboard: buttons,
      one_time_keyboard: true
    }
  }
};
```

Should the state wish to transition into its a new `State` (NOT previous), it should return an object with the `transition: [StateObject]` parameter. The `StateObject` represents a newly initialized object that inherits `State`, which will be pushed to the stack that is tracked in `StateManager`. It will then call the `render()` function of the next `StateObject`.

```javascript
if (processedData.transition) {
  this.state.unshift(processedData.transition);
  return this.addIDParam(this.state[0].render());
}
```

This should be all you need to get started. For a much more detailed understanding on how each component in the bot works, do take a look at the actual source code. The functionality of messages is also limited by the Telegram Bot API, so do consult the docs there too! 