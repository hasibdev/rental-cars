## W-File-Uploader is a mutli-purpose files uploader

### Step-1: Import index.js file in your entry file:

```
<!-- example -->
import Toaster from "../components/base/WFileUploader";
export default {
  components: {
    Toaster,
  },
}
```

### Step-2: Use component like this:

```
<BFileUploader
  v-model="files" // return []
  max="5000000" //bytes
  endpoint="/admin/documentsupload/store"
  rm-endpoint="/admin/documentsupload/delete"
  :types="['image/png', 'application/pdf']"
  color="#276EF1"
/>
```
