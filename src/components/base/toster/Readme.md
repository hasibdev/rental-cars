### Step-1: Import index.js file in your entry file:

```
import Toaster from "../components/base/toster";
export default {
  components: {
    Toaster,
  },
}
```

### Step-2: configure pinia store like this:

```
import { defineStore } from 'pinia';

export const useToaster = defineStore('toaster', {
  state: () => ({
    messages: [],
    config: {
        timeInterval: 3000,
        positon: "top right" // "top right" || "top left" || "bottom right" || "top left"
    }
  }),

  actions: {
    setToaster(message) {
      this.messages.push({
        ...message,
        id: (Math.random().toString(36) + Date.now().toString(36)).substr(2)
      })
    },
    removeToaster(payload) {
        const index = this.messages.indexOf(payload);
        if (index > -1) {
            this.messages.splice(index, 1);
        }
    },
  }
})
```

### Step-3: how use in template message:

```
import { useToaster } from "@/stores/toaster";
setup() {
  const toastStore = useToaster();

  toastStore.setToaster({
    type: "success", // success || error || warning
    text: "You are successfully done",
  });

  return {};
},
```
