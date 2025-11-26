# build 
 - yarn
 - sudo gem install cocoapods
 - brew install cocoapods
 - cd ios
 - rm -rf Pods
 - rm -rf Podfile.lock
 - pod install --repo-update
 - build app in xcode
 - yarn start (yarn start -- --reset-cache)

# version:
 - npm: 10.9.2
 - node: 23.9.0
 - ruby: 3.4.2
 - react: 19.0.0
 - react-native: 0.78.0

# Icons (library react-native-vector-icons)
 - https://oblador.github.io/react-native-vector-icons/#FontAwesome

# Store & Storage
 - Zustand (https://zustand.docs.pmnd.rs/getting-started/introduction)
 - MMKV (https://github.com/mrousavy/react-native-mmkv?tab=readme-ov-file)

# Common component
  <!-- list -->
  - [Button](#button)
  - [Input](#input)
  - [Radio & RadioGroup](#radio--radiogroup)
  - [Switch](#switch)

  ## Button

  ### 📌 Features
  - Supports different button types: `primary`, `text`, `link`.
  - Customizable colors, text styles, and icons.
  - Handles `disabled` state.

  ### 🚀 Usage

  ```tsx
  import React from 'react';
  import { View } from 'react-native';
  import { Button } from '@/components/common/Button';

  const App = () => {
    return (
      <View>
        <Button text="Primary Button" type="primary" onPress={() => console.log('Clicked!')} />
        <Button text="Text Button" type="text" onPress={() => console.log('Clicked!')} />
        <Button text="Link Button" type="link" onPress={() => console.log('Clicked!')} />
      </View>
    );
  };

  export default App;
  ```

  ### 📌 Props

  | Prop              | Type                                      | Description                                    |
  |------------------|------------------------------------------|------------------------------------------------|
  | `icon`           | `ReactNode \| ImageSourcePropType`      | Optional icon to display.                     |
  | `text`           | `string`                                | Button text.                                  |
  | `type`           | `'primary' \| 'text' \| 'link'`        | Button style type.                            |
  | `color`          | `string`                                | Button background color.                      |
  | `className`      | `string`                                | Custom class name for styling.                |
  | `classNameText`  | `string`                                | Custom class name for text.                   |
  | `textColor`      | `string`                                | Text color.                                   |
  | `textFont`       | `string`                                | Font size or custom font styles.              |
  | `onPress`        | `() => void`                           | Callback when the button is pressed.          |
  | `disabled`       | `boolean`                               | Disables button when `true`.                  |
  | `contentClassName` | `string`                              | Custom class name for content container.      |

  ---

  ## Input

  ### 📌 Features
  - Supports `label`, `placeholder`, and different `keyboardType`.
  - Toggle secure text visibility for passwords.
  - Allows custom left and right components (e.g., icons).

  ### 🚀 Usage

  ```tsx
  import React, { useState } from 'react';
  import { View } from 'react-native';
  import { Input } from '@/components/common/Input';

  const App = () => {
    const [text, setText] = useState('');

    return (
      <View>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={text}
          onChangeText={setText}
          keyboardType="email-address"
        />
      </View>
    );
  };

  export default App;
  ```

  ### 📌 Props

  | Prop            | Type                                      | Description                                  |
  |----------------|------------------------------------------|----------------------------------------------|
  | `label`        | `string`                                 | Input label (optional).                     |
  | `placeholder`  | `string`                                 | Placeholder text.                           |
  | `value`        | `string`                                 | Current input value.                        |
  | `onChangeText` | `(text: string) => void`                | Callback when text changes.                 |
  | `secureTextEntry` | `boolean`                             | Enables password mode (toggle visibility).  |
  | `keyboardType` | `'default' \| 'email-address' \| 'numeric' \| 'phone-pad'` | Defines keyboard type.                     |
  | `leftComponent` | `ReactNode`                             | Optional left-side component (e.g., icon).  |
  | `rightComponent` | `ReactNode`                            | Optional right-side component (e.g., icon). |
  | `disabled`     | `boolean`                                | Disables input when `true`.                 |

  ## Radio & RadioGroup

  ### 📌 Features
  - `Radio`: A single selectable radio button.
  - `RadioGroup`: A group of radio buttons allowing single selection.
  - Supports custom labels and values.
  - Highlights selected radio button.

  ### 🚀 Usage

  ```tsx
  import React, { useState } from 'react';
  import { View } from 'react-native';
  import { RadioGroup } from '@/components/common/RadioGroup';

  const App = () => {
    const [selectedValue, setSelectedValue] = useState('option1');

    return (
      <View>
        <RadioGroup
          options={[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
          ]}
          selectedValue={selectedValue}
          onValueChange={setSelectedValue}
        />
      </View>
    );
  };

  export default App;
  ```

  ### 📌 Props

  #### `Radio`
  | Prop      | Type      | Description                      |
  |-----------|----------|----------------------------------|
  | `label`   | `string` | Text displayed next to radio.   |
  | `value`   | `string` | Value associated with radio.    |
  | `selected` | `boolean` | Whether the radio is selected. |
  | `onPress` | `() => void` | Callback when pressed.       |

  #### `RadioGroup`
  | Prop           | Type                                | Description                        |
  |---------------|------------------------------------|------------------------------------|
  | `options`     | `{ label: string, value: string }[]` | List of radio options.            |
  | `selectedValue` | `string`                          | Current selected radio value.     |
  | `onValueChange` | `(value: string) => void`        | Callback when selection changes. |

  ## Switch
  
  ### 📌 Features
  - Toggle switch with animation.
  - Supports `label` for better accessibility.
  - Handles `disabled` state to prevent interaction.

  ### 🚀 Usage

  ```tsx
  import React, { useState } from 'react';
  import { View } from 'react-native';
  import { Switch } from '@/components/common/Switch';

  const App = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
      <View>
        <Switch value={isEnabled} onValueChange={setIsEnabled} label="Enable Notifications" />
      </View>
    );
  };

  export default App;
  ```

  ### 📌 Props

  | Prop           | Type                     | Description                                      |
  |---------------|-------------------------|--------------------------------------------------|
  | `value`       | `boolean`                | Current switch state.                           |
  | `onValueChange` | `(value: boolean) => void` | Callback when toggled.                          |
  | `label`       | `string` (optional)      | Text label for the switch.                      |
  | `disabled`    | `boolean` (optional)     | Disables switch interaction when `true`.        |
