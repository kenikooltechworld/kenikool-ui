# Your First Component

Build your first Kenikool UI button in less than 5 minutes.

---

## Prerequisites

Before you begin, make sure you've [installed Kenikool UI](./installation.md).

---

## Step 1: Create an HTML File

Create a new file called `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Kenikool Component</title>
  
  <!-- Import Kenikool UI styles -->
  <link rel="stylesheet" href="node_modules/kenikool-ui/dist/styles/base.css">
</head>
<body>
  
  <!-- We'll add components here -->
  
  <!-- Import Kenikool UI components -->
  <script type="module">
    import 'kenikool-ui/vanilla';
  </script>
</body>
</html>
```

---

## Step 2: Add Your First Button

Add a button inside the `<body>` tag:

```html
<body>
  <k-button v="filled lg primary">
    Click me!
  </k-button>

  <script type="module">
    import 'kenikool-ui/vanilla';
  </script>
</body>
```

Open `index.html` in your browser. You should see a large, blue button!

---

## Step 3: Understanding the `v` Attribute

The `v` attribute controls how the button looks:

```html
<k-button v="filled lg primary">Click me!</k-button>
```

Let's break it down:
- **`filled`** = Button style (solid background)
- **`lg`** = Button size (large)
- **`primary`** = Button color (blue/accent color)

### Try Different Combinations

Change the `v` attribute to see different styles:

```html
<!-- Small outlined button -->
<k-button v="outlined sm success">Small Success</k-button>

<!-- Medium ghost button -->
<k-button v="ghost md warning">Medium Warning</k-button>

<!-- Extra large filled button -->
<k-button v="filled xl error">XL Error</k-button>
```

**→** [Learn more about the v attribute system](../concepts/v-attribute-system.md)

---

## Step 4: Add Button States

Buttons can show loading or disabled states:

```html
<!-- Loading button -->
<k-button v="filled lg primary loading">
  Processing...
</k-button>

<!-- Disabled button -->
<k-button v="filled lg primary disabled">
  Disabled
</k-button>
```

---

## Step 5: Handle Click Events

Add interactivity with JavaScript:

```html
<k-button v="filled lg primary" id="myButton">
  Click me!
</k-button>

<p id="output"></p>

<script type="module">
  import 'kenikool-ui/vanilla';
  
  const button = document.getElementById('myButton');
  const output = document.getElementById('output');
  let count = 0;
  
  button.addEventListener('k:click', () => {
    count++;
    output.textContent = `Button clicked ${count} times`;
  });
</script>
```

**Note:** Kenikool components dispatch custom events with the `k:` prefix (e.g., `k:click` instead of `click`).

---

## Step 6: Create a Button Group

Let's build something more interesting - a group of buttons:

```html
<body>
  <k-stack v="gap-4 p-8">
    <k-text v="h2 text-2xl semibold">Button Actions</k-text>
    
    <k-row v="gap-3">
      <k-button v="filled md primary" id="save">
        Save
      </k-button>
      <k-button v="outlined md" id="cancel">
        Cancel
      </k-button>
      <k-button v="ghost md error" id="delete">
        Delete
      </k-button>
    </k-row>
    
    <k-box v="surface p-4 r-md">
      <k-text v="text-sm muted" id="message">
        Click a button to see the action
      </k-text>
    </k-box>
  </k-stack>

  <script type="module">
    import 'kenikool-ui/vanilla';
    
    const message = document.getElementById('message');
    
    document.getElementById('save').addEventListener('k:click', () => {
      message.textContent = '✓ Changes saved successfully';
    });
    
    document.getElementById('cancel').addEventListener('k:click', () => {
      message.textContent = '↩ Action cancelled';
    });
    
    document.getElementById('delete').addEventListener('k:click', () => {
      message.textContent = '🗑 Item deleted';
    });
  </script>
</body>
```

### New Components Used

- **`<k-stack>`** - Vertical layout container with `gap-4` (16px spacing) and `p-8` (32px padding)
- **`<k-text>`** - Typography component with size and weight control
- **`<k-row>`** - Horizontal layout container with `gap-3` (12px spacing)
- **`<k-box>`** - Container with background surface and padding

**→** [Learn more about layout components](../reference/components/layout/grid.md) *(Coming soon)*

---

## Step 7: Add Loading States

Make buttons interactive with loading states:

```html
<k-button v="filled lg primary" id="submitButton">
  Submit Form
</k-button>

<script type="module">
  import 'kenikool-ui/vanilla';
  
  const button = document.getElementById('submitButton');
  
  button.addEventListener('k:click', async () => {
    // Add loading state
    button.setAttribute('v', 'filled lg primary loading');
    button.textContent = 'Submitting...';
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Remove loading state
    button.setAttribute('v', 'filled lg success');
    button.textContent = 'Success!';
  });
</script>
```

---

## Complete Example

Here's a complete, working example putting it all together:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Kenikool Component</title>
  <link rel="stylesheet" href="node_modules/kenikool-ui/dist/styles/base.css">
</head>
<body>
  <k-container>
    <k-stack v="gap-8 p-8">
      <!-- Header -->
      <k-stack v="gap-2">
        <k-text v="h1 text-4xl bold">Welcome to Kenikool UI</k-text>
        <k-text v="text-lg muted">
          You just created your first component!
        </k-text>
      </k-stack>
      
      <!-- Button Examples -->
      <k-stack v="gap-4">
        <k-text v="h3 text-xl semibold">Button Variants</k-text>
        <k-row v="gap-3 wrap">
          <k-button v="filled md primary">Filled Primary</k-button>
          <k-button v="outlined md success">Outlined Success</k-button>
          <k-button v="ghost md warning">Ghost Warning</k-button>
          <k-button v="filled md error">Filled Error</k-button>
          <k-button v="outlined md info">Outlined Info</k-button>
        </k-row>
      </k-stack>
      
      <!-- Button Sizes -->
      <k-stack v="gap-4">
        <k-text v="h3 text-xl semibold">Button Sizes</k-text>
        <k-row v="gap-3 align-center">
          <k-button v="filled xs primary">XS</k-button>
          <k-button v="filled sm primary">Small</k-button>
          <k-button v="filled md primary">Medium</k-button>
          <k-button v="filled lg primary">Large</k-button>
          <k-button v="filled xl primary">XL</k-button>
        </k-row>
      </k-stack>
      
      <!-- Interactive Example -->
      <k-stack v="gap-4">
        <k-text v="h3 text-xl semibold">Interactive Example</k-text>
        <k-button v="filled lg primary" id="interactiveButton">
          Click me!
        </k-button>
        <k-box v="surface p-4 r-md">
          <k-text v="text-base" id="output">
            Button not clicked yet
          </k-text>
        </k-box>
      </k-stack>
    </k-stack>
  </k-container>

  <script type="module">
    import 'kenikool-ui/vanilla';
    
    let count = 0;
    const button = document.getElementById('interactiveButton');
    const output = document.getElementById('output');
    
    button.addEventListener('k:click', () => {
      count++;
      output.textContent = `Button clicked ${count} time${count > 1 ? 's' : ''}! 🎉`;
    });
  </script>
</body>
</html>
```

---

## Using React

If you prefer React, here's the equivalent:

```tsx
import { useState } from 'react';
import { 
  Button, 
  Stack, 
  Row, 
  Text, 
  Box, 
  Container 
} from 'kenikool-ui/react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Container>
      <Stack gap="8" padding="8">
        {/* Header */}
        <Stack gap="2">
          <Text as="h1" size="4xl" weight="bold">
            Welcome to Kenikool UI
          </Text>
          <Text size="lg" muted>
            You just created your first component!
          </Text>
        </Stack>
        
        {/* Button Examples */}
        <Stack gap="4">
          <Text as="h3" size="xl" weight="semibold">
            Button Variants
          </Text>
          <Row gap="3" wrap>
            <Button variant="filled" size="md" color="primary">
              Filled Primary
            </Button>
            <Button variant="outlined" size="md" color="success">
              Outlined Success
            </Button>
            <Button variant="ghost" size="md" color="warning">
              Ghost Warning
            </Button>
          </Row>
        </Stack>
        
        {/* Interactive Example */}
        <Stack gap="4">
          <Text as="h3" size="xl" weight="semibold">
            Interactive Example
          </Text>
          <Button 
            variant="filled" 
            size="lg" 
            color="primary"
            onClick={() => setCount(count + 1)}
          >
            Click me!
          </Button>
          <Box surface="surface" padding="4" radius="md">
            <Text size="base">
              {count === 0 
                ? 'Button not clicked yet' 
                : `Button clicked ${count} time${count > 1 ? 's' : ''}! 🎉`
              }
            </Text>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
```

---

## What You Learned

Congratulations! You've learned:

✅ How to import and use Kenikool UI  
✅ The `v` attribute system for styling  
✅ Button variants, sizes, and colors  
✅ Button states (loading, disabled)  
✅ Handling click events  
✅ Using layout components (Stack, Row, Box)  
✅ Creating interactive UIs  

---

## Next Steps

Now that you've created your first component:

1. **[Explore All Universal Tokens](../reference/tokens/universal-tokens.md)** - Master size, color, radius, and state tokens
2. **[Learn Layout Tokens](../reference/tokens/layout-tokens.md)** - Build responsive layouts
3. **[Understand the v Attribute System](../concepts/v-attribute-system.md)** - Learn how tokens work
4. **[Browse All Components](../reference/components/README.md)** - See what else you can build *(Coming soon)*

---

## Try It in the Playground

Want to experiment without setting up a project?

**→** [Open Playground](http://localhost:3001/playground.html)

---

## Need Help?

- **[GitHub Issues](https://github.com/your-repo/kenikool-ui/issues)** - Report bugs
- **[Discussions](https://github.com/your-repo/kenikool-ui/discussions)** - Ask questions
- **[Component Reference](../reference/components/README.md)** - Full API docs *(Coming soon)*
